const Lecture = require('../models/Lecture');

exports.createLecture = async (req, res) => {
    try {
        const result = await Lecture.create(req.body);
        res.status(201).json({ message: 'Lecture created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating lecture' });
    }
};

exports.getAllLectures = async (req, res) => {
    try {
        const results = await Lecture.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getLectureById = async (req, res) => {
    try {
        const result = await Lecture.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Lecture not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.updateLecture = async (req, res) => {
    try {
        const result = await Lecture.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Lecture not found' });
        res.status(200).json({ message: 'Lecture updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating lecture' });
    }
};

exports.deleteLecture = async (req, res) => {
    try {
        const result = await Lecture.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Lecture not found' });
        res.status(200).json({ message: 'Lecture deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting lecture' });
    }
};
