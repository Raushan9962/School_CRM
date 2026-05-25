const prisma = require('../config/prismaClient');

exports.createClass = async (req, res) => {
    try {
        const { name, section, schoolId } = req.body;
        const newClass = await prisma.class.create({
            data: { name, section, schoolId }
        });
        res.status(201).json({ message: 'Class created successfully', class: newClass });
    } catch (error) {
        res.status(500).json({ error: 'Error creating class' });
    }
};

exports.getAllClasses = async (req, res) => {
    try {
        const classes = await prisma.class.findMany({ include: { school: true } });
        res.status(200).json(classes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching classes' });
    }
};

exports.getClassById = async (req, res) => {
    try {
        const { id } = req.params;
        const cls = await prisma.class.findUnique({
            where: { id: parseInt(id) },
            include: { students: true, timetables: true }
        });
        if (!cls) return res.status(404).json({ error: 'Class not found' });
        res.status(200).json(cls);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching class details' });
    }
};

exports.updateClass = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedClass = await prisma.class.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json({ message: 'Class updated successfully', class: updatedClass });
    } catch (error) {
        res.status(500).json({ error: 'Error updating class' });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.class.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting class' });
    }
};
