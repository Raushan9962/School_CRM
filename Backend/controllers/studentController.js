const Student = require('../models/Student');

exports.createStudent = async (req, res) => {
    try {
        const result = await Student.create(req.body);
        res.status(201).json({ message: 'Student created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating student' });
    }
};

exports.getAllStudents = async (req, res) => {
    try {
        const results = await Student.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const result = await Student.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Student not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const result = await Student.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Student not found' });
        res.status(200).json({ message: 'Student updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating student' });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const result = await Student.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Student not found' });
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting student' });
    }
};
