const Timetable = require('../models/Timetable');

exports.createTimetable = async (req, res) => {
    try {
        const result = await Timetable.create(req.body);
        res.status(201).json({ message: 'Timetable created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating timetable' });
    }
};

exports.getAllTimetables = async (req, res) => {
    try {
        const results = await Timetable.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getTimetableById = async (req, res) => {
    try {
        const result = await Timetable.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Timetable not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.updateTimetable = async (req, res) => {
    try {
        const result = await Timetable.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Timetable not found' });
        res.status(200).json({ message: 'Timetable updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating timetable' });
    }
};

exports.deleteTimetable = async (req, res) => {
    try {
        const result = await Timetable.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Timetable not found' });
        res.status(200).json({ message: 'Timetable deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting timetable' });
    }
};
