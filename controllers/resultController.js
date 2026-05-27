const Result = require('../models/Result');

exports.createResult = async (req, res) => {
    try {
        const result = await Result.create(req.body);
        res.status(201).json({ message: 'Result created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating result' });
    }
};

exports.getAllResults = async (req, res) => {
    try {
        const results = await Result.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getResultById = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Result not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.updateResult = async (req, res) => {
    try {
        const result = await Result.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Result not found' });
        res.status(200).json({ message: 'Result updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating result' });
    }
};

exports.deleteResult = async (req, res) => {
    try {
        const result = await Result.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Result not found' });
        res.status(200).json({ message: 'Result deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting result' });
    }
};
