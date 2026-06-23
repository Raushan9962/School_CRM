const Student = require('../models/Student');
const pool = require('../config/db');

exports.createStudent = async (req, res) => {
    try {
        const result = await Student.create(req.body);
        res.status(201).json({ message: 'Student created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating student' });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const results = await Student.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const result = await Student.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Student not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

// Custom queries for Student Dashboard
exports.getStudentProfileByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await pool.query(`
            SELECT s.*, u.email, u.phone, u.name, c.name as class_name
            FROM students s
            JOIN users u ON s.user_id = u.id
            LEFT JOIN classes c ON s.class_id = c.id
            WHERE s.user_id = $1
        `, [userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Student profile not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching student profile' });
    }
};

exports.getStudentDashboardStats = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // 1. Get student ID
        const studentRes = await pool.query(`SELECT id FROM students WHERE user_id = $1`, [userId]);
        if (studentRes.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const studentId = studentRes.rows[0].id;

        // 2. Attendance %
        const attRes = await pool.query(`
            SELECT 
                COUNT(*) as total_days,
                SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_days
            FROM attendance 
            WHERE student_id = $1
        `, [studentId]);
        
        let attendancePercentage = 0;
        if (attRes.rows[0].total_days > 0) {
            attendancePercentage = Math.round((attRes.rows[0].present_days / attRes.rows[0].total_days) * 100);
        }

        // 3. Pending Fees
        const feesRes = await pool.query(`
            SELECT SUM(amount) as pending_amount 
            FROM fees 
            WHERE student_id = $1 AND status = 'Pending'
        `, [studentId]);
        const pendingFees = feesRes.rows[0].pending_amount || 0;

        // 4. Latest Result
        const resultRes = await pool.query(`
            SELECT marks_obtained, total_marks, grade 
            FROM results 
            WHERE student_id = $1 
            ORDER BY created_at DESC LIMIT 1
        `, [studentId]);
        const latestResult = resultRes.rows.length > 0 ? resultRes.rows[0] : null;

        res.status(200).json({
            attendancePercentage,
            pendingFees,
            latestResult
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching dashboard stats' });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const result = await Student.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Student not found' });
        res.status(200).json({ message: 'Student updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating student' });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const result = await Student.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Student not found' });
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting student' });
    }
};
