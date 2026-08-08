const Teacher = require('../models/Teacher');

exports.createTeacher = async (req, res) => {
    try {
        const result = await Teacher.create(req.body);
        res.status(201).json({ message: 'Teacher created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating teacher' });
    }
};

const pool = require('../config/db');

exports.getAllTeachers = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.*, u.name, u.email, u.phone 
            FROM teachers t 
            JOIN users u ON t.user_id = u.id
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getTeacherById = async (req, res) => {
    try {
        const result = await Teacher.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Teacher not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.updateTeacher = async (req, res) => {
    try {
        const result = await Teacher.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Teacher not found' });
        res.status(200).json({ message: 'Teacher updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating teacher' });
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        const result = await Teacher.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Teacher not found' });
        res.status(200).json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting teacher' });
    }
};
