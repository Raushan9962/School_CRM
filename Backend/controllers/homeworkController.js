const prisma = require('../config/prismaClient');

exports.createHomework = async (req, res) => {
    try {
        const { title, description, dueDate, attachment, teacherId } = req.body;
        const homework = await prisma.homework.create({
            data: { title, description, dueDate: new Date(dueDate), attachment, teacherId }
        });
        res.status(201).json({ message: 'Homework created successfully', homework });
    } catch (error) {
        res.status(500).json({ error: 'Error creating homework' });
    }
};

exports.getAllHomeworks = async (req, res) => {
    try {
        const homeworks = await prisma.homework.findMany({ include: { teacher: true } });
        res.status(200).json(homeworks);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching homeworks' });
    }
};

exports.getHomeworkById = async (req, res) => {
    try {
        const { id } = req.params;
        const homework = await prisma.homework.findUnique({
            where: { id: parseInt(id) },
            include: { teacher: true }
        });
        if (!homework) return res.status(404).json({ error: 'Homework not found' });
        res.status(200).json(homework);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching homework details' });
    }
};

exports.updateHomework = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (updates.dueDate) updates.dueDate = new Date(updates.dueDate);

        const homework = await prisma.homework.update({
            where: { id: parseInt(id) },
            data: updates
        });
        res.status(200).json({ message: 'Homework updated successfully', homework });
    } catch (error) {
        res.status(500).json({ error: 'Error updating homework' });
    }
};

exports.deleteHomework = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.homework.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Homework deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting homework' });
    }
};
