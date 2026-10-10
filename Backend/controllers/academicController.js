const pool = require('../config/db');

// ----- Teacher Planners -----

exports.createPlanner = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const teacherId = req.user.userId;
        const { className, section, subject, date, topic, homeAssignment, plan } = req.body;
        
        let attachmentUrl = null;
        if (req.file) {
            attachmentUrl = `/uploads/${req.file.filename}`;
        }

        const result = await pool.query(
            `INSERT INTO teacher_planners (school_id, teacher_id, class_name, section, subject, date, topic, home_assignment, plan, attachment_url) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [schoolId, teacherId, className, section, subject, date, topic, homeAssignment, plan, attachmentUrl]
        );

        return res.status(201).json({ success: true, message: 'Planner created successfully', data: result.rows[0] });
    } catch (error) {
        console.error('Error creating planner:', error);
        return res.status(500).json({ success: false, message: 'Failed to create planner' });
    }
};

exports.getPlanners = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        
        const result = await pool.query(`
            SELECT p.*, u.name as teacher_name 
            FROM teacher_planners p 
            JOIN users u ON p.teacher_id = u.id 
            WHERE p.school_id = $1 
            ORDER BY p.date DESC
        `, [schoolId]);

        return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching planners:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch planners' });
    }
};

exports.deletePlanner = async (req, res) => {
    try {
        const { id } = req.params;
        const schoolId = req.user.schoolId;
        
        await pool.query('DELETE FROM teacher_planners WHERE id = $1 AND school_id = $2', [id, schoolId]);
        return res.status(200).json({ success: true, message: 'Planner deleted successfully' });
    } catch (error) {
        console.error('Error deleting planner:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete planner' });
    }
};


// ----- Periods -----

exports.createPeriod = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        const { startTime, endTime } = req.body;
        
        const result = await pool.query(
            'INSERT INTO periods (school_id, start_time, end_time) VALUES ($1, $2, $3) RETURNING *',
            [schoolId, startTime, endTime]
        );

        return res.status(201).json({ success: true, message: 'Period created successfully', data: result.rows[0] });
    } catch (error) {
        console.error('Error creating period:', error);
        return res.status(500).json({ success: false, message: 'Failed to create period' });
    }
};

exports.getPeriods = async (req, res) => {
    try {
        const schoolId = req.user.schoolId;
        
        const result = await pool.query('SELECT * FROM periods WHERE school_id = $1 ORDER BY start_time ASC', [schoolId]);

        return res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Error fetching periods:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch periods' });
    }
};

exports.deletePeriod = async (req, res) => {
    try {
        const { id } = req.params;
        const schoolId = req.user.schoolId;
        
        await pool.query('DELETE FROM periods WHERE id = $1 AND school_id = $2', [id, schoolId]);
        return res.status(200).json({ success: true, message: 'Period deleted successfully' });
    } catch (error) {
        console.error('Error deleting period:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete period' });
    }
};
