const prisma = require('../config/prismaClient');

exports.markAttendance = async (req, res) => {
    try {
        const { studentId, date, status } = req.body;
        const attendance = await prisma.attendance.create({
            data: { studentId, date: new Date(date), status }
        });
        res.status(201).json({ message: 'Attendance marked successfully', attendance });
    } catch (error) {
        res.status(500).json({ error: 'Error marking attendance' });
    }
};

exports.getAllAttendance = async (req, res) => {
    try {
        const attendanceRecords = await prisma.attendance.findMany({ include: { student: true } });
        res.status(200).json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching attendance' });
    }
};

exports.getAttendanceByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const attendance = await prisma.attendance.findMany({
            where: { studentId: parseInt(studentId) },
        });
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching attendance for student' });
    }
};

exports.updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        if (updates.date) updates.date = new Date(updates.date);

        const attendance = await prisma.attendance.update({
            where: { id: parseInt(id) },
            data: updates
        });
        res.status(200).json({ message: 'Attendance updated successfully', attendance });
    } catch (error) {
        res.status(500).json({ error: 'Error updating attendance' });
    }
};

exports.deleteAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.attendance.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ message: 'Attendance deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting attendance' });
    }
};
