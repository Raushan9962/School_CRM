const Class = require('../models/Class');

exports.createClass = async (req, res) => {
    try {
        const result = await Class.create(req.body);
        res.status(201).json({ message: 'Class created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating class' });
    }
};

exports.getAllClasss = async (req, res) => {
    try {
        const results = await Class.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getClassById = async (req, res) => {
    try {
        const result = await Class.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Class not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.updateClass = async (req, res) => {
    try {
        const result = await Class.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Class not found' });
        res.status(200).json({ message: 'Class updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating class' });
    }
};

exports.deleteClass = async (req, res) => {
    try {
        const result = await Class.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Class not found' });
        res.status(200).json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting class' });
    }
};
