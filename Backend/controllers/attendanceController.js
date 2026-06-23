const Attendance = require('../models/Attendance');
const pool = require('../config/db');

exports.createAttendance = async (req, res) => {
    try {
        const result = await Attendance.create(req.body);
        res.status(201).json({ message: 'Attendance created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating attendance' });
    }
};

exports.scanAttendanceQR = async (req, res) => {
    try {
        const { qrPayload } = req.body;
        if (!qrPayload) {
            return res.status(400).json({ error: 'QR Payload missing' });
        }
        
        let payloadData;
        try {
            payloadData = JSON.parse(qrPayload);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid QR Payload format' });
        }

        const today = new Date().toISOString().split('T')[0];
        
        // Check if QR payload has today's date
        if (payloadData.date !== today) {
            return res.status(400).json({ error: 'QR Code is expired or invalid for today' });
        }

        const userId = req.user.id;
        const userRole = (req.user.role || req.user.roleName || '').toLowerCase();

        if (userRole === 'student') {
            // Find student_id and class_id
            const studentResult = await pool.query('SELECT id, class_id FROM students WHERE user_id = $1', [userId]);
            if (studentResult.rows.length === 0) {
                return res.status(404).json({ error: 'Student profile not found' });
            }
            const studentId = studentResult.rows[0].id;
            const classId = studentResult.rows[0].class_id;

            // Check if already marked
            const existing = await pool.query('SELECT id FROM attendance WHERE student_id = $1 AND date = $2', [studentId, today]);
            if (existing.rows.length > 0) {
                return res.status(400).json({ error: 'Attendance already marked for today' });
            }

            await pool.query('INSERT INTO attendance (student_id, class_id, date, status, remarks) VALUES ($1, $2, $3, $4, $5)', [studentId, classId, today, 'Present', 'QR Scan']);
            return res.status(200).json({ message: 'Attendance marked successfully' });

        } else {
            // For teachers, principals, receptionists, etc.
            const existing = await pool.query('SELECT id FROM staff_attendance WHERE user_id = $1 AND date = $2', [userId, today]);
            if (existing.rows.length > 0) {
                return res.status(400).json({ error: 'Attendance already marked for today' });
            }

            await pool.query('INSERT INTO staff_attendance (user_id, date, status, remarks) VALUES ($1, $2, $3, $4)', [userId, today, 'Present', 'QR Scan']);
            return res.status(200).json({ message: 'Attendance marked successfully' });
        }

    } catch (error) {
        console.error('Scan QR Error:', error);
        res.status(500).json({ error: 'Internal server error while marking attendance' });
    }
};

exports.getAllAttendance = async (req, res) => {
    try {
        const results = await Attendance.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getAttendanceById = async (req, res) => {
    try {
        const result = await Attendance.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Attendance not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.getAttendanceByStudentId = async (req, res) => {
    try {
        // Here studentId in URL is actually the users.id from frontend localStorage user obj
        const userId = req.params.studentId;
        const result = await pool.query(`
            SELECT a.*, s.id as student_id 
            FROM attendance a
            JOIN students s ON a.student_id = s.id
            WHERE s.user_id = $1
            ORDER BY a.date DESC
        `, [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching student attendance' });
    }
};

exports.updateAttendance = async (req, res) => {
    try {
        const result = await Attendance.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Attendance not found' });
        res.status(200).json({ message: 'Attendance updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating attendance' });
    }
};

exports.deleteAttendance = async (req, res) => {
    try {
        const result = await Attendance.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Attendance not found' });
        res.status(200).json({ message: 'Attendance deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting attendance' });
    }
};
