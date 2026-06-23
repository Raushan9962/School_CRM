const Complaint = require('../models/Complaint');
const pool = require('../config/db');

exports.createComplaint = async (req, res) => {
    try {
        const result = await Complaint.create(req.body);
        res.status(201).json({ message: 'Complaint created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating complaint' });
    }
};

exports.getComplaintsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await pool.query('SELECT * FROM complaints WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching complaints' });
    }
};

exports.getAllComplaints = async (req, res) => {
    try {
        const results = await Complaint.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.updateComplaintStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const result = await pool.query('UPDATE complaints SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Complaint not found' });
        res.status(200).json({ message: 'Complaint updated successfully', data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating complaint' });
    }
};
