const Homework = require('../models/Homework');
const pool = require('../config/db');

exports.createHomework = async (req, res) => {
    try {
        const result = await Homework.create(req.body);
        res.status(201).json({ message: 'Homework created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating homework' });
    }
};

exports.getAllHomeworks = async (req, res) => {
    try {
        const results = await Homework.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getHomeworkById = async (req, res) => {
    try {
        const result = await Homework.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Homework not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.getHomeworkByClass = async (req, res) => {
    try {
        const classId = req.params.classId;
        const result = await pool.query(`
            SELECT h.*, s.name as subject_name 
            FROM homework h
            JOIN subjects s ON h.subject_id = s.id
            WHERE h.class_id = $1
            ORDER BY h.due_date ASC
        `, [classId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching class homework' });
    }
};

exports.getHomeworkByStudentUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await pool.query(`
            SELECT h.*, s.name as subject_name 
            FROM homework h
            JOIN subjects s ON h.subject_id = s.id
            JOIN students st ON h.class_id = st.class_id
            WHERE st.user_id = $1
            ORDER BY h.due_date ASC
        `, [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching student homework' });
    }
};

exports.updateHomework = async (req, res) => {
    try {
        const result = await Homework.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Homework not found' });
        res.status(200).json({ message: 'Homework updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating homework' });
    }
};

exports.deleteHomework = async (req, res) => {
    try {
        const result = await Homework.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Homework not found' });
        res.status(200).json({ message: 'Homework deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting homework' });
    }
};
