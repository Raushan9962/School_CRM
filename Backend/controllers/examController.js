const prisma = require('../config/prismaClient');

exports.createExam = async (req, res) => {
    try {
        const { name, examDate } = req.body;
        const exam = await prisma.exam.create({
            data: { name, examDate: new Date(examDate) }
        });
        res.status(201).json({ message: 'Exam created successfully', exam });
    } catch (error) {
        res.status(500).json({ error: 'Error creating exam' });
    }
};

exports.getAllExams = async (req, res) => {
    try {
        const exams = await prisma.exam.findMany({ include: { results: true } });
        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching exams' });
    }
};

exports.getExamById = async (req, res) => {
    try {
        const { id } = req.params;
        const exam = await prisma.exam.findUnique({
            where: { id: parseInt(id) },
            include: { results: true }
        });
        if (!exam) return res.status(404).json({ error: 'Exam not found' });
        res.status(200).json(exam);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching exam details' });
    }
};

exports.updateExam = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (updates.examDate) updates.examDate = new Date(updates.examDate);

        const exam = await prisma.exam.update({
            where: { id: parseInt(id) },
            data: updates
        });
        res.status(200).json({ message: 'Exam updated successfully', exam });
    } catch (error) {
        res.status(500).json({ error: 'Error updating exam' });
    }
};

exports.deleteExam = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.exam.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Exam deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting exam' });
    }
};
