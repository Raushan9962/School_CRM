const Notification = require('../models/Notification');
const pool = require('../config/db');

exports.createNotification = async (req, res) => {
    try {
        const result = await Notification.create(req.body);
        res.status(201).json({ message: 'Notification created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating notification' });
    }
};

exports.getAllNotifications = async (req, res) => {
    try {
        const results = await Notification.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getNotificationById = async (req, res) => {
    try {
        const result = await Notification.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Notification not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.getNotificationsByRole = async (req, res) => {
    try {
        const role = req.params.role;
        const result = await pool.query(`
            SELECT * FROM notifications 
            WHERE target_role = $1 OR target_role = 'All' OR target_role IS NULL
            ORDER BY created_at DESC
        `, [role]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching notifications' });
    }
};

exports.updateNotification = async (req, res) => {
    try {
        const result = await Notification.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Notification not found' });
        res.status(200).json({ message: 'Notification updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating notification' });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const result = await Notification.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Notification not found' });
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting notification' });
    }
};
