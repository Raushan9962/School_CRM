const pool = require('../config/db');
const { sendGenericEmail } = require('../utils/mailer');

exports.getDashboardStats = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;

        // 1. Total Students
        const studentsRes = await pool.query(`SELECT COUNT(*) FROM users WHERE role_name = 'Student' AND school_id = $1`, [schoolId]);
        const totalStudents = parseInt(studentsRes.rows[0].count);

        // 2. Total Teachers
        const teachersRes = await pool.query(`SELECT COUNT(*) FROM users WHERE role_name = 'Teacher' AND school_id = $1`, [schoolId]);
        const totalTeachers = parseInt(teachersRes.rows[0].count);

        // 3. Specific Staff Roles
        const roles = ['Accountant', 'Librarian', 'Receptionist', 'Transport Staff', 'Hostel Warden', 'HR'];
        const staffRes = await pool.query(`SELECT role_name, COUNT(*) FROM users WHERE role_name = ANY($1) AND school_id = $2 GROUP BY role_name`, [roles, schoolId]);
        
        const staffCounts = {
            totalAccountants: 0,
            totalLibrarians: 0,
            totalReceptionists: 0,
            totalTransportStaff: 0,
            totalWardens: 0,
            totalHR: 0
        };

        staffRes.rows.forEach(row => {
            if (row.role_name === 'Accountant') staffCounts.totalAccountants = parseInt(row.count);
            if (row.role_name === 'Librarian') staffCounts.totalLibrarians = parseInt(row.count);
            if (row.role_name === 'Receptionist') staffCounts.totalReceptionists = parseInt(row.count);
            if (row.role_name === 'Transport Staff') staffCounts.totalTransportStaff = parseInt(row.count);
            if (row.role_name === 'Hostel Warden') staffCounts.totalWardens = parseInt(row.count);
            if (row.role_name === 'HR') staffCounts.totalHR = parseInt(row.count);
        });

        // 4. Today Attendance (Students Present %)
        const attendanceRes = await pool.query(`
            SELECT COUNT(*) 
            FROM attendance a
            JOIN students s ON a.student_id = s.id
            WHERE s.school_id = $1 AND a.date = CURRENT_DATE AND a.status = 'Present'
        `, [schoolId]);
        const presentCount = parseInt(attendanceRes.rows[0].count);
        let todayAttendancePercent = 0;
        if (totalStudents > 0) {
            todayAttendancePercent = Math.round((presentCount / totalStudents) * 100);
        }

        // 5. Fees Collected (This month)
        const feesRes = await pool.query(`
            SELECT COALESCE(SUM(amount_paid), 0) as total 
            FROM fee_receipts 
            WHERE school_id = $1 AND status = 'Paid' 
            AND EXTRACT(MONTH FROM payment_date) = EXTRACT(MONTH FROM CURRENT_DATE)
            AND EXTRACT(YEAR FROM payment_date) = EXTRACT(YEAR FROM CURRENT_DATE)
        `, [schoolId]);
        const feesCollected = parseInt(feesRes.rows[0].total) || 0;

        // 6. Pending Fees
        const pendingFeesRes = await pool.query(`
            SELECT COALESCE(SUM(balance), 0) as total 
            FROM fee_receipts 
            WHERE school_id = $1
        `, [schoolId]);
        const pendingFees = parseInt(pendingFeesRes.rows[0].total) || 0;

        // Mock data for Phase 1 where tables don't exist yet
        const upcomingExams = 15; // Mock: Next exam in 15 days
        const newAdmissions = 12; // Mock: 12 new admissions this month
        const notifications = 5;  // Mock: 5 pending approvals
        const birthdayToday = 2;  // Mock: 2 birthdays today

        return res.status(200).json({
            success: true,
            data: {
                totalStudents,
                totalTeachers,
                ...staffCounts,
                todayAttendancePercent,
                feesCollected,
                pendingFees,
                upcomingExams,
                newAdmissions,
                notifications,
                birthdayToday
            }
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
    }
};

// --- Staff Attendance ---

exports.getStaffAttendance = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const date = req.query.date || new Date().toISOString().split('T')[0];

        // Get all staff (Teachers + Others) for the school, along with their attendance for the date
        const result = await pool.query(`
            SELECT 
                u.id as user_id, u.name, u.role_name as role, u.image,
                sa.id as attendance_id, sa.status, sa.remarks
            FROM users u
            LEFT JOIN staff_attendance sa ON u.id = sa.user_id AND sa.date = $2
            WHERE u.school_id = $1 AND u.role_name NOT IN ('Student', 'Parent', 'School Admin', 'Super Admin')
            ORDER BY u.name ASC
        `, [schoolId, date]);

        return res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
        console.error("Error fetching staff attendance:", error);
        return res.status(500).json({ success: false, message: 'Failed to fetch staff attendance' });
    }
};

exports.markStaffAttendance = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const { userId, date, status, remarks } = req.body;

        if (!userId || !date || !status) {
            return res.status(400).json({ success: false, message: 'userId, date, and status are required' });
        }

        // Verify user belongs to this school and is staff
        const userCheck = await pool.query(`
            SELECT id FROM users 
            WHERE id = $1 AND school_id = $2 AND role_name NOT IN ('Student', 'Parent', 'School Admin', 'Super Admin')
        `, [userId, schoolId]);

        if (userCheck.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Staff not found in your school' });
        }

        const existing = await pool.query('SELECT id FROM staff_attendance WHERE user_id = $1 AND date = $2', [userId, date]);
        if (existing.rows.length > 0) {
            const updated = await pool.query(
                'UPDATE staff_attendance SET status = $1, remarks = $2 WHERE user_id = $3 AND date = $4 RETURNING *',
                [status, remarks || null, userId, date]
            );
            return res.status(200).json({ success: true, message: 'Attendance updated', data: updated.rows[0] });
        }

        const result = await pool.query(
            'INSERT INTO staff_attendance (user_id, date, status, remarks) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, date, status, remarks || null]
        );

        return res.status(201).json({ success: true, message: 'Attendance marked', data: result.rows[0] });
    } catch (error) {
        console.error("Error marking staff attendance:", error);
        return res.status(500).json({ success: false, message: 'Failed to mark attendance' });
    }
};

// --- Leave Management ---

exports.getLeaveRequests = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;

        const result = await pool.query(`
            SELECT 
                l.id, l.type, l.from_date, l.to_date, l.days, l.reason, l.status, l.created_at,
                u.name as applicant_name, u.role_name as applicant_role, u.image as applicant_image
            FROM leaves l
            JOIN users u ON l.user_id = u.id
            WHERE u.school_id = $1
            ORDER BY l.created_at DESC
        `, [schoolId]);

        return res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
        console.error("Error fetching leave requests:", error);
        return res.status(500).json({ success: false, message: 'Failed to fetch leave requests' });
    }
};

exports.updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const schoolId = req.user.schoolId;

        if (!status || !['Approved', 'Rejected', 'Pending'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Valid status is required' });
        }

        // Verify leave request belongs to school
        const check = await pool.query(`
            SELECT l.id FROM leaves l
            JOIN users u ON l.user_id = u.id
            WHERE l.id = $1 AND u.school_id = $2
        `, [id, schoolId]);

        if (check.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Leave request not found' });
        }

        const updated = await pool.query(
            'UPDATE leaves SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        // Fetch user email
        const userRes = await pool.query(
            `SELECT name, email FROM users WHERE id = $1`,
            [updated.rows[0].user_id]
        );
        if (userRes.rows.length > 0 && userRes.rows[0].email) {
            const user = userRes.rows[0];
            const leaveHtml = `
                <h3>Leave Request Update</h3>
                <p>Dear ${user.name},</p>
                <p>Your leave request has been <strong>${status}</strong> by the administration.</p>
                <p>Regards,<br/>School Admin</p>
            `;
            await sendGenericEmail(user.email, `Leave Request ${status}`, leaveHtml);
        }

        return res.status(200).json({ success: true, message: 'Leave status updated', data: updated.rows[0] });
    } catch (error) {
        console.error("Error updating leave status:", error);
        return res.status(500).json({ success: false, message: 'Failed to update leave status' });
    }
};

// --- Finance Management ---

exports.getFees = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query(`
            SELECT f.*, s.class_enrolled, s.section, u.name as student_name, u.image as student_image
            FROM fees f
            JOIN students s ON f.student_id = s.id
            JOIN users u ON s.user_id = u.id
            WHERE s.school_id = $1
            ORDER BY f.created_at DESC
        `, [schoolId]);

        return res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
        console.error("Error fetching fees:", error);
        return res.status(500).json({ success: false, message: 'Failed to fetch fees' });
    }
};

exports.collectFee = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const { studentId, amount, type, status, paidDate } = req.body;

        if (!studentId || !amount || !type || !status) {
            return res.status(400).json({ success: false, message: 'studentId, amount, type, and status are required' });
        }

        const result = await pool.query(
            'INSERT INTO fees (student_id, amount, type, status, paid_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [studentId, amount, type, status, paidDate || null]
        );

        return res.status(201).json({ success: true, message: 'Fee collected successfully', data: result.rows[0] });
    } catch (error) {
        console.error("Error collecting fee:", error);
        return res.status(500).json({ success: false, message: 'Failed to collect fee' });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query(`
            SELECT e.*, u.name as recorded_by_name
            FROM expenses e
            LEFT JOIN users u ON e.recorded_by = u.id
            WHERE e.school_id = $1
            ORDER BY e.date DESC, e.created_at DESC
        `, [schoolId]);

        return res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
        console.error("Error fetching expenses:", error);
        return res.status(500).json({ success: false, message: 'Failed to fetch expenses' });
    }
};

exports.addExpense = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const userId = req.user.userId;
        const { category, amount, date, description } = req.body;

        if (!category || !amount || !date) {
            return res.status(400).json({ success: false, message: 'category, amount, and date are required' });
        }

        const result = await pool.query(
            'INSERT INTO expenses (school_id, category, amount, date, description, recorded_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [schoolId, category, amount, date, description || null, userId]
        );

        return res.status(201).json({ success: true, message: 'Expense added successfully', data: result.rows[0] });
    } catch (error) {
        console.error("Error adding expense:", error);
        return res.status(500).json({ success: false, message: 'Failed to add expense' });
    }
};

// --- Transport Management ---

exports.getTransportRoutes = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const result = await pool.query(`
            SELECT * FROM transport_routes
            WHERE school_id = $1
            ORDER BY route_name ASC
        `, [schoolId]);

        // Could also fetch stops here if needed
        return res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
    } catch (error) {
        console.error("Error fetching transport routes:", error);
        return res.status(500).json({ success: false, message: 'Failed to fetch transport routes' });
    }
};

exports.addTransportRoute = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const { routeName, busNumber, driverName, driverPhone, monthlyFee } = req.body;

        if (!routeName || !busNumber || !driverName) {
            return res.status(400).json({ success: false, message: 'routeName, busNumber, and driverName are required' });
        }

        const result = await pool.query(
            'INSERT INTO transport_routes (school_id, route_name, bus_number, driver_name, driver_phone, monthly_fee) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [schoolId, routeName, busNumber, driverName, driverPhone || null, monthlyFee || null]
        );

        return res.status(201).json({ success: true, message: 'Transport route added successfully', data: result.rows[0] });
    } catch (error) {
        console.error("Error adding transport route:", error);
        return res.status(500).json({ success: false, message: 'Failed to add transport route' });
    }
};
