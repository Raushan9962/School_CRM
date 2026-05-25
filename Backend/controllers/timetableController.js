const prisma = require('../config/prismaClient');

exports.createTimetable = async (req, res) => {
    try {
        const item = await prisma.timetable.create({ data: req.body });
        res.status(201).json({ message: 'Timetable created successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating timetable' });
    }
};

exports.getAllTimetables = async (req, res) => {
    try {
        const items = await prisma.timetable.findMany();
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching timetables' });
    }
};

exports.getTimetableById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.timetable.findUnique({ where: { id: parseInt(id) } });
        if (!item) return res.status(404).json({ error: 'Timetable not found' });
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching timetable' });
    }
};

exports.updateTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.timetable.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json({ message: 'Timetable updated successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating timetable' });
    }
};

exports.deleteTimetable = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.timetable.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Timetable deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting timetable' });
    }
};
