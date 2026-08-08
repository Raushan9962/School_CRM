const Subject = require('../models/Subject');

exports.createSubject = async (req, res) => {
    try {
        const result = await Subject.create(req.body);
        res.status(201).json({ message: 'Subject created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating subject', details: error.message, stack: error.stack });
    }
};

exports.getAllSubjects = async (req, res) => {
    try {
        const results = await Subject.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getSubjectById = async (req, res) => {
    try {
        const result = await Subject.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Subject not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.updateSubject = async (req, res) => {
    try {
        const result = await Subject.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Subject not found' });
        res.status(200).json({ message: 'Subject updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating subject' });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        const result = await Subject.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Subject not found' });
        res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting subject' });
    }
};
