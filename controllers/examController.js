const Exam = require('../models/Exam');

exports.createExam = async (req, res) => {
    try {
        const result = await Exam.create(req.body);
        res.status(201).json({ message: 'Exam created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating exam' });
    }
};

exports.getAllExams = async (req, res) => {
    try {
        const results = await Exam.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getExamById = async (req, res) => {
    try {
        const result = await Exam.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Exam not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.updateExam = async (req, res) => {
    try {
        const result = await Exam.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Exam not found' });
        res.status(200).json({ message: 'Exam updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating exam' });
    }
};

exports.deleteExam = async (req, res) => {
    try {
        const result = await Exam.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Exam not found' });
        res.status(200).json({ message: 'Exam deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting exam' });
    }
};
