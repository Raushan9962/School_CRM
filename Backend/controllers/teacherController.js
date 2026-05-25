const prisma = require('../config/prismaClient');

exports.createTeacher = async (req, res) => {
    try {
        const { userId, employeeId, qualification, experience } = req.body;
        const teacher = await prisma.teacher.create({
            data: { userId, employeeId, qualification, experience }
        });
        res.status(201).json({ message: 'Teacher created successfully', teacher });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating teacher' });
    }
};

exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await prisma.teacher.findMany({ include: { user: true, subjects: true } });
        res.status(200).json(teachers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching teachers' });
    }
};

exports.getTeacherById = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await prisma.teacher.findUnique({
            where: { id: parseInt(id) },
            include: { user: true, subjects: true, timetables: true }
        });
        if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
        res.status(200).json(teacher);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching teacher details' });
    }
};

exports.updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await prisma.teacher.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json({ message: 'Teacher updated successfully', teacher });
    } catch (error) {
        res.status(500).json({ error: 'Error updating teacher' });
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.teacher.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting teacher' });
    }
};
