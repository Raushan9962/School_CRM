const prisma = require('../config/prismaClient');

exports.createNotification = async (req, res) => {
    try {
        const item = await prisma.notification.create({ data: req.body });
        res.status(201).json({ message: 'Notification created successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating notification' });
    }
};

exports.getAllNotifications = async (req, res) => {
    try {
        const items = await prisma.notification.findMany();
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching notifications' });
    }
};

exports.getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.notification.findUnique({ where: { id: parseInt(id) } });
        if (!item) return res.status(404).json({ error: 'Notification not found' });
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching notification' });
    }
};

exports.updateNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.notification.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json({ message: 'Notification updated successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating notification' });
    }
};

exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.notification.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting notification' });
    }
};
