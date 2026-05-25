const prisma = require('../config/prismaClient');

exports.createEvent = async (req, res) => {
    try {
        const item = await prisma.event.create({ data: req.body });
        res.status(201).json({ message: 'Event created successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating event' });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const items = await prisma.event.findMany();
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching events' });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.event.findUnique({ where: { id: parseInt(id) } });
        if (!item) return res.status(404).json({ error: 'Event not found' });
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching event' });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.event.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json({ message: 'Event updated successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating event' });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.event.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting event' });
    }
};
