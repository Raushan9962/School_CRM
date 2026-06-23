const Timetable = require('../models/Timetable');
const pool = require('../config/db');

exports.createTimetable = async (req, res) => {
    try {
        const result = await Timetable.create(req.body);
        res.status(201).json({ message: 'Timetable created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating timetable' });
    }
};

exports.getAllTimetables = async (req, res) => {
    try {
        const results = await Timetable.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getTimetableById = async (req, res) => {
    try {
        const result = await Timetable.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Timetable not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.getTimetableByStudentId = async (req, res) => {
    try {
        const userId = req.params.studentId;
        const result = await pool.query(`
            SELECT t.*, s.name as subject_name, tch.name as teacher_name 
            FROM timetables t
            JOIN students st ON t.class_id = st.class_id
            JOIN subjects s ON t.subject_id = s.id
            LEFT JOIN teachers tch ON t.teacher_id = tch.id
            WHERE st.user_id = $1
            ORDER BY 
                CASE t.day_of_week
                    WHEN 'Monday' THEN 1
                    WHEN 'Tuesday' THEN 2
                    WHEN 'Wednesday' THEN 3
                    WHEN 'Thursday' THEN 4
                    WHEN 'Friday' THEN 5
                    WHEN 'Saturday' THEN 6
                    WHEN 'Sunday' THEN 7
                END,
                t.start_time
        `, [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching student timetable' });
    }
};

exports.updateTimetable = async (req, res) => {
    try {
        const result = await Timetable.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Timetable not found' });
        res.status(200).json({ message: 'Timetable updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating timetable' });
    }
};

exports.deleteTimetable = async (req, res) => {
    try {
        const result = await Timetable.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Timetable not found' });
        res.status(200).json({ message: 'Timetable deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting timetable' });
    }
};
