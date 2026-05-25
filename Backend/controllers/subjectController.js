const prisma = require('../config/prismaClient');

exports.createSubject = async (req, res) => {
    try {
        const { name, code, teacherId } = req.body;
        const subject = await prisma.subject.create({
            data: { name, code, teacherId }
        });
        res.status(201).json({ message: 'Subject created successfully', subject });
    } catch (error) {
        res.status(500).json({ error: 'Error creating subject' });
    }
};

exports.getAllSubjects = async (req, res) => {
    try {
        const subjects = await prisma.subject.findMany({ include: { teacher: true } });
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching subjects' });
    }
};

exports.getSubjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await prisma.subject.findUnique({
            where: { id: parseInt(id) },
            include: { teacher: true, timetables: true }
        });
        if (!subject) return res.status(404).json({ error: 'Subject not found' });
        res.status(200).json(subject);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching subject details' });
    }
};

exports.updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const subject = await prisma.subject.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json({ message: 'Subject updated successfully', subject });
    } catch (error) {
        res.status(500).json({ error: 'Error updating subject' });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.subject.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting subject' });
    }
};
