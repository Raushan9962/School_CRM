const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Class = require('../models/Class');

exports.getDashboardStats = async (req, res) => {
    try {
        const students = await Student.findAll();
        const teachers = await Teacher.findAll();
        const classes = await Class.findAll();

        res.status(200).json({
            stats: {
                students: students.length,
                teachers: teachers.length,
                classes: classes.length,
                attendance: '94%' // Will be computed from attendance logs later
            },
            notices: [
                { id: 1, title: 'Term 1 Exam Timetable Released', date: new Date().toLocaleDateString() },
                { id: 2, title: 'Staff Meeting Tomorrow', date: 'Tomorrow' }
            ]
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getStudents = async (req, res) => {
    try {
        const students = await Student.findAll();
        // Format the database records to match the frontend expectations
        const formattedStudents = students.map(s => ({
            id: s.id,
            name: `${s.first_name || 'Unknown'} ${s.last_name || ''}`.trim(),
            class: s.class_id ? `Class ${s.class_id}` : 'Unassigned',
            roll: s.id,
            attendance: '90%', // Placeholder
            grade: 'A' // Placeholder
        }));
        
        res.status(200).json({ data: formattedStudents });
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.findAll();
        const formattedTeachers = teachers.map(t => ({
            id: t.id,
            name: `${t.first_name || ''} ${t.last_name || ''}`.trim() || 'Unknown',
            subject: t.subject_specialization || 'General',
            exp: t.experience_years ? `${t.experience_years} Years` : 'N/A',
            status: 'Present'
        }));
        res.status(200).json({ data: formattedTeachers });
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getClasses = async (req, res) => {
    try {
        const classes = await Class.findAll();
        const formattedClasses = classes.map(c => ({
            id: c.id,
            className: c.class_name || `Class ${c.id}`,
            section: c.section || 'A',
            teacher: 'Assigned',
            strength: c.capacity || 40
        }));
        res.status(200).json({ data: formattedClasses });
    } catch (error) {
        console.error("Error fetching classes:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAttendance = async (req, res) => res.status(200).json({ data: { studentAvg: '94.5%', teacherAvg: '98.2%', trends: [{ class: 'Class 10', rate: '96%', color: '#10b981' }, { class: 'Class 9', rate: '92%', color: '#f59e0b' }] } });
exports.getExams = async (req, res) => res.status(200).json({ data: [{ id: 1, name: 'Term 1 Final', classes: '1 to 12', date: '15 Oct 2026', status: 'Completed' }] });
exports.getFees = async (req, res) => res.status(200).json({ data: { totalExpected: 5000000, totalCollected: 4200000, pending: 800000, recent: [{ id: 1, student: 'Aarav Sharma', amount: 15000, date: 'Today', status: 'Paid' }] } });
exports.getAdmissions = async (req, res) => res.status(200).json({ data: [{ id: 'APP-101', name: 'Kabir Khan', appliedClass: 'Class 6', date: '12 May 2026', status: 'Pending Review' }] });
exports.getStaff = async (req, res) => res.status(200).json({ data: [{ id: 1, name: 'Suresh Kumar', role: 'Security Head', shift: 'Morning', status: 'Present' }] });
exports.getCommunications = async (req, res) => res.status(200).json({ data: [{ id: 1, type: 'Email', subject: 'Fee Reminder Term 1', audience: 'All Parents', date: 'Yesterday', status: 'Sent' }] });
exports.getEvents = async (req, res) => res.status(200).json({ data: [{ id: 1, title: 'Annual Sports Day', type: 'Sports', date: '25 Nov 2026', time: '09:00 AM' }] });
