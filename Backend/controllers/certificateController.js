const Certificate = require('../models/Certificate');
const pool = require('../config/db');

exports.createCertificate = async (req, res) => {
    try {
        const result = await Certificate.create(req.body);
        res.status(201).json({ message: 'Certificate created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating certificate' });
    }
};

exports.getAllCertificates = async (req, res) => {
    try {
        const results = await Certificate.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getCertificateById = async (req, res) => {
    try {
        const result = await Certificate.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Certificate not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.getCertificatesByStudentUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await pool.query(`
            SELECT c.* 
            FROM certificates c
            JOIN students s ON c.student_id = s.id
            WHERE s.user_id = $1
            ORDER BY c.issue_date DESC
        `, [userId]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching certificates' });
    }
};

exports.updateCertificate = async (req, res) => {
    try {
        const result = await Certificate.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Certificate not found' });
        res.status(200).json({ message: 'Certificate updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating certificate' });
    }
};

exports.deleteCertificate = async (req, res) => {
    try {
        const result = await Certificate.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Certificate not found' });
        res.status(200).json({ message: 'Certificate deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting certificate' });
    }
};
