const Fee = require('../models/Fee');
const pool = require('../config/db');

exports.createFee = async (req, res) => {
    try {
        const result = await Fee.create(req.body);
        res.status(201).json({ message: 'Fee created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating fee' });
    }
};

exports.getAllFees = async (req, res) => {
    try {
        const results = await Fee.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getFeeById = async (req, res) => {
    try {
        const result = await Fee.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Fee not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.getFeesByStudentId = async (req, res) => {
    try {
        // Here studentId in URL is actually the users.id from frontend localStorage user obj
        const userId = req.params.studentId;
        const result = await pool.query(`
            SELECT f.*, s.id as student_id 
            FROM fees f
            JOIN students s ON f.student_id = s.id
            WHERE s.user_id = $1
            ORDER BY f.due_date DESC
        `, [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching student fees' });
    }
};

exports.updateFee = async (req, res) => {
    try {
        const result = await Fee.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Fee not found' });
        res.status(200).json({ message: 'Fee updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating fee' });
    }
};

exports.deleteFee = async (req, res) => {
    try {
        const result = await Fee.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Fee not found' });
        res.status(200).json({ message: 'Fee deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting fee' });
    }
};
