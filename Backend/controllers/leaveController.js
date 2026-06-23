const Leave = require('../models/Leave');
const pool = require('../config/db');

exports.createLeave = async (req, res) => {
    try {
        const result = await Leave.create(req.body);
        res.status(201).json({ message: 'Leave request created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating leave request' });
    }
};

exports.getLeavesByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await pool.query('SELECT * FROM leaves WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching leaves' });
    }
};

exports.getAllLeaves = async (req, res) => {
    try {
        const results = await Leave.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const result = await pool.query('UPDATE leaves SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Leave not found' });
        res.status(200).json({ message: 'Leave updated successfully', data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating leave' });
    }
};
