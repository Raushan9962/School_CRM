const prisma = require('../config/prismaClient');

exports.createCourse = async (req, res) => {
    try {
        const item = await prisma.course.create({ data: req.body });
        res.status(201).json({ message: 'Course created successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating course' });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const items = await prisma.course.findMany();
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching courses' });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.course.findUnique({ where: { id: parseInt(id) } });
        if (!item) return res.status(404).json({ error: 'Course not found' });
        res.status(200).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching course' });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await prisma.course.update({
            where: { id: parseInt(id) },
            data: req.body
        });
        res.status(200).json({ message: 'Course updated successfully', item });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating course' });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.course.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting course' });
    }
};
