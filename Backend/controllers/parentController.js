const pool = require('../config/db');

exports.getChildren = async (req, res) => {
    try {
        const parentUserId = req.user?.id || 1; 
        
        try {
            const result = await pool.query(
                `SELECT u.id as "studentId", u.name, u.email, u.image, u.phone as mobile
                 FROM parents p
                 JOIN users u ON p.student_id = u.id
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
