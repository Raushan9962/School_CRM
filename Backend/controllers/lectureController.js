const prisma = require('../config/prismaClient');

exports.createLecture = async (req, res) => {
    try {
        const item = await prisma.lecture.create({ data: req.body });
        res.status(201).json({ message: 'Lecture created successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating lecture' });
    }
};

exports.getAllLectures = async (req, res) => {
    try {
        const items = await prisma.lecture.findMany();
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching lectures' });
    }
};

exports.getLectureById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.lecture.findUnique({ where: { id: parseInt(id) } });
        if (!item) return res.status(404).json({ error: 'Lecture not found' });
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching lecture' });
    }
};

exports.updateLecture = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.lecture.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json({ message: 'Lecture updated successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating lecture' });
    }
};

exports.deleteLecture = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.lecture.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Lecture deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting lecture' });
    }
};
