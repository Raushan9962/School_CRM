const pool = require('../config/db');

// ==========================================
// SHARED STAFF HR MODULES: Attendance, Leaves, Salary
// ==========================================

exports.getMyAttendance = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(`
            SELECT date, status, remarks 
            FROM attendance 
            WHERE user_id = $1 
            ORDER BY date DESC
        `, [userId]);
        
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch attendance' });
    }
};

exports.markMyAttendance = async (req, res) => {
    try {
        const userId = req.user.id;
        const schoolId = req.user.school_id;
        const role = req.user.role || 'Staff';
        const today = new Date().toISOString().split('T')[0];

        // Check if already marked
        const check = await pool.query('SELECT id FROM attendance WHERE user_id = $1 AND date = $2', [userId, today]);
        if (check.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Attendance already marked for today' });
        }

        // Insert attendance
        await pool.query(`
            INSERT INTO attendance (school_id, user_id, date, status, role)
            VALUES ($1, $2, $3, 'Present', $4)
        `, [schoolId, userId, today, role]);

        res.status(200).json({ success: true, message: 'Attendance marked successfully' });
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ success: false, message: 'Failed to mark attendance' });
    }
};

exports.getMyLeaves = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(`
            SELECT id, 
                   type as leave_type, 
                   type, 
                   from_date as start_date, 
                   from_date, 
                   to_date as end_date, 
                   to_date, 
                   days, 
                   reason, 
                   status, 
                   created_at
            FROM leaves
            WHERE user_id = $1
            ORDER BY created_at DESC
        `, [userId]);

        // Calculate used leaves
        let leaveBalance = { casual: 8, medical: 5, earned: 12 };
        try {
            const leavesUsedRes = await pool.query(`
                SELECT type, SUM(COALESCE(days, (to_date - from_date + 1))) as days_used
                FROM leaves
                WHERE user_id = $1 AND status = 'Approved'
                GROUP BY type
            `, [userId]);

            leavesUsedRes.rows.forEach(row => {
                const type = (row.type || '').toLowerCase();
                const used = parseInt(row.days_used || 0);
                if (type.includes('casual')) leaveBalance.casual = Math.max(0, 8 - used);
                if (type.includes('medical') || type.includes('sick')) leaveBalance.medical = Math.max(0, 5 - used);
                if (type.includes('earned')) leaveBalance.earned = Math.max(0, 12 - used);
            });
        } catch (calcErr) {
            console.error('Leave balance calc error:', calcErr.message);
        }

        res.status(200).json({ success: true, data: result.rows, balance: leaveBalance });
    } catch (error) {
        console.error('Error fetching leaves:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch leaves' });
    }
};

exports.applyLeave = async (req, res) => {
    try {
        const userId = req.user.id;
        const { leave_type, type, start_date, from_date, end_date, to_date, reason } = req.body;

        const selectedType = leave_type || type;
        const startDate = start_date || from_date;
        const endDate = end_date || to_date;

        if (!selectedType || !startDate || !endDate || !reason) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const sDate = new Date(startDate);
        const eDate = new Date(endDate);
        const days = Math.max(1, Math.round((eDate - sDate) / (1000 * 60 * 60 * 24)) + 1);

        const result = await pool.query(`
            INSERT INTO leaves (user_id, type, from_date, to_date, days, reason, status)
            VALUES ($1, $2, $3, $4, $5, $6, 'Pending')
            RETURNING id, type as leave_type, type, from_date as start_date, from_date, to_date as end_date, to_date, days, reason, status, created_at
        `, [userId, selectedType, startDate, endDate, days, reason]);

        res.status(201).json({ success: true, message: 'Leave application submitted successfully', data: result.rows[0] });
    } catch (error) {
        console.error('Error applying leave:', error);
        res.status(500).json({ success: false, message: 'Failed to apply leave' });
    }
};

exports.getMySalary = async (req, res) => {
    try {
        const userId = req.user.id;
        // Staff ID usually matches User ID for payrolls
        const result = await pool.query(`
            SELECT id, month, year, basic_salary, allowances, deductions, net_salary, payment_date, status
            FROM payrolls
            WHERE staff_id = $1
            ORDER BY year DESC, 
                     CASE month
                        WHEN 'December' THEN 12 WHEN 'November' THEN 11 WHEN 'October' THEN 10 WHEN 'September' THEN 9
                        WHEN 'August' THEN 8 WHEN 'July' THEN 7 WHEN 'June' THEN 6 WHEN 'May' THEN 5
                        WHEN 'April' THEN 4 WHEN 'March' THEN 3 WHEN 'February' THEN 2 WHEN 'January' THEN 1
                     END DESC
        `, [userId]);
        
        res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching salary:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch salary details' });
    }
};
