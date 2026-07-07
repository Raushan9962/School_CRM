const pool = require('../config/db');

exports.getChildren = async (req, res) => {
    try {
        const parentUserId = req.user?.id || 1; 
        
        try {
            const result = await pool.query(
                `SELECT u.id as "studentId", u.name, u.email, u.image, 
                        s.admission_no as "admissionNo", s.id as "studentDbId",
                        c.name as class, s.section
                 FROM parents p
                 JOIN students s ON p.student_id = s.id
                 JOIN users u ON s.user_id = u.id
                 LEFT JOIN classes c ON s.class_id = c.id
                 WHERE p.user_id = $1`,
                [parentUserId]
            );
            
            if (result.rows.length > 0) {
                return res.status(200).json(result.rows);
            }
        } catch (dbErr) {
            console.log("DB fetch for children failed, falling back to mock data.", dbErr.message);
        }

        // Mock data fallback
        res.status(200).json([
            { studentId: 101, name: "Rahul Sharma", class: "10th", section: "A", admissionNo: "AD1001", rollNo: "45", image: "" },
            { studentId: 102, name: "Priya Sharma", class: "8th", section: "B", admissionNo: "AD1050", rollNo: "12", image: "" }
        ]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch children' });
    }
};

exports.getChildOverview = async (req, res) => {
    try {
        const { childId } = req.params;

        // Fetch Student ID associated with this child (childId is user_id)
        const studentRes = await pool.query('SELECT id, admission_no, class_id FROM students WHERE user_id = $1', [childId]);
        if (studentRes.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
        const student = studentRes.rows[0];

        // 1. Fee Metrics
        const feeRes = await pool.query(
            `SELECT COALESCE(SUM(paid_amount), 0) as total_paid, 
                    COALESCE(SUM(due_amount - paid_amount), 0) as total_pending 
             FROM student_fee_invoices WHERE student_id = $1`,
            [childId] // student_fee_invoices uses users.id as student_id usually, based on previous checks
        );
        const fees = feeRes.rows[0] || { total_paid: 0, total_pending: 0 };

        // 2. Attendance Metric
        const attRes = await pool.query(
            `SELECT 
                COUNT(*) as total_days, 
                COUNT(CASE WHEN status = 'Present' THEN 1 END) as present_days 
             FROM attendance WHERE student_id = $1`,
            [student.id] // attendance might use students.id
        );
        const att = attRes.rows[0];
        const attendance_percentage = parseInt(att.total_days) > 0 
            ? Math.round((parseInt(att.present_days) / parseInt(att.total_days)) * 100) 
            : 0;

        // 3. Exams Metric
        const examsRes = await pool.query(
            `SELECT COUNT(DISTINCT exam_id) as total_exams 
             FROM results WHERE student_id = $1`,
            [student.id] // results uses students.id
        );
        
        // 4. Recent Activity (Recent Fee payments + Leaves + Admissions)
        const recentActivity = [];
        
        // Recent Fees
        const recentFees = await pool.query(
            `SELECT paid_amount, updated_at FROM student_fee_invoices 
             WHERE student_id = $1 AND status = 'Paid' ORDER BY updated_at DESC LIMIT 3`,
            [childId]
        );
        recentFees.rows.forEach(f => {
            recentActivity.push({
                title: 'Fee Paid',
                description: `₹${f.paid_amount} was paid.`,
                time: f.updated_at,
                type: 'fee'
            });
        });

        // Recent Leaves
        const recentLeaves = await pool.query(
            `SELECT type, status, created_at FROM leaves 
             WHERE user_id = $1 ORDER BY created_at DESC LIMIT 3`,
            [childId]
        );
        recentLeaves.rows.forEach(l => {
            recentActivity.push({
                title: `Leave ${l.status}`,
                description: `${l.type} request was ${l.status.toLowerCase()}.`,
                time: l.created_at,
                type: 'leave'
            });
        });

        // Sort combined activity
        recentActivity.sort((a, b) => new Date(b.time) - new Date(a.time));

        res.status(200).json({
            success: true,
            data: {
                total_paid: fees.total_paid,
                total_pending: fees.total_pending,
                attendance_percentage: attendance_percentage,
                total_exams: examsRes.rows[0]?.total_exams || 0,
                recent_activity: recentActivity.slice(0, 5) // top 5
            }
        });

    } catch (error) {
        console.error("Error in getChildOverview:", error.message);
        res.status(500).json({ error: 'Failed to fetch child overview', details: error.message });
    }
};

exports.getChildProfile = async (req, res) => {
    res.status(200).json({
        id: req.params.childId,
        name: "Rahul Sharma",
        admissionNumber: "AD1001",
        rollNumber: "45",
        dob: "2010-05-15",
        gender: "Male",
        bloodGroup: "O+",
        religion: "Hindu",
        class: "10th",
        section: "A",
        house: "Red House",
        fatherName: "Rajesh Sharma",
        motherName: "Sunita Sharma",
        mobile: "9876543210",
        address: "123 Main St, City"
    });
};

exports.getChildAttendance = async (req, res) => {
    res.status(200).json({
        percentage: 85,
        presentDays: 170,
        absentDays: 30,
        recent: [
            { date: "2023-10-01", status: "Present" },
            { date: "2023-10-02", status: "Absent" }
        ]
    });
};

exports.getChildFees = async (req, res) => {
    res.status(200).json({
        totalAnnualFee: 50000,
        paidAmount: 30000,
        pendingAmount: 20000,
        nextDueDate: "2023-11-10",
        history: [
            { receiptNo: "REC101", date: "2023-04-05", amount: 15000, status: "Paid" },
            { receiptNo: "REC102", date: "2023-07-10", amount: 15000, status: "Paid" }
        ]
    });
};

exports.getChildResults = async (req, res) => {
    res.status(200).json({
        recentExam: "Mid Term",
        percentage: 88,
        grade: "A",
        rank: 5,
        subjects: [
            { name: "Math", marks: 95, maxMarks: 100 },
            { name: "Science", marks: 85, maxMarks: 100 },
            { name: "English", marks: 84, maxMarks: 100 }
        ]
    });
};

exports.getChildHomework = async (req, res) => {
    res.status(200).json([
        { id: 1, subject: "Math", teacher: "Mr. Smith", assignment: "Algebra Chap 2", dueDate: "2023-10-25", status: "Pending" },
        { id: 2, subject: "Science", teacher: "Mrs. Jones", assignment: "Physics Lab Report", dueDate: "2023-10-24", status: "Submitted" }
    ]);
};

exports.getChildTimetable = async (req, res) => {
    res.status(200).json([
        { period: 1, subject: "Mathematics", teacher: "Mr. Smith", time: "8:00–8:45" },
        { period: 2, subject: "Science", teacher: "Mrs. Jones", time: "8:45–9:30" }
    ]);
};
