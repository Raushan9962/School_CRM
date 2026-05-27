const Homework = require('../models/Homework');

exports.createHomework = async (req, res) => {
    try {
        const result = await Homework.create(req.body);
        res.status(201).json({ message: 'Homework created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating homework' });
    }
};

exports.getAllHomeworks = async (req, res) => {
    try {
        const results = await Homework.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getHomeworkById = async (req, res) => {
    try {
        const result = await Homework.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Homework not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.updateHomework = async (req, res) => {
    try {
        const result = await Homework.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Homework not found' });
        res.status(200).json({ message: 'Homework updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating homework' });
    }
};

exports.deleteHomework = async (req, res) => {
    try {
        const result = await Homework.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Homework not found' });
        res.status(200).json({ message: 'Homework deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting homework' });
    }
};
