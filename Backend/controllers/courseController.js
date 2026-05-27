const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
    try {
        const result = await Course.create(req.body);
        res.status(201).json({ message: 'Course created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating course' });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const results = await Course.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const result = await Course.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Course not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const result = await Course.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Course not found' });
        res.status(200).json({ message: 'Course updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating course' });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const result = await Course.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Course not found' });
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting course' });
    }
};
