const Attendance = require('../models/Attendance');

exports.createAttendance = async (req, res) => {
    try {
        const result = await Attendance.create(req.body);
        res.status(201).json({ message: 'Attendance created successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating attendance' });
    }
};

exports.getAllAttendances = async (req, res) => {
    try {
        const results = await Attendance.findAll();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching records' });
    }
};

exports.getAttendanceById = async (req, res) => {
    try {
        const result = await Attendance.findById(req.params.id);
        if (!result) return res.status(404).json({ error: 'Attendance not found' });
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching details' });
    }
};

exports.updateAttendance = async (req, res) => {
    try {
        const result = await Attendance.update(req.params.id, req.body);
        if (!result) return res.status(404).json({ error: 'Attendance not found' });
        res.status(200).json({ message: 'Attendance updated successfully', data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating attendance' });
    }
};

exports.deleteAttendance = async (req, res) => {
    try {
        const result = await Attendance.delete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Attendance not found' });
        res.status(200).json({ message: 'Attendance deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting attendance' });
    }
};
