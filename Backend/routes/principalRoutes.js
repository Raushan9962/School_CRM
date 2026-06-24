const express = require('express');
const router = express.Router();
const principalController = require('../controllers/principalController');
const { auth } = require('../middleware/auth'); // Optional if using auth

// GET dashboard statistics
router.get('/dashboard-stats', principalController.getDashboardStats);

// GET Daily Attendance QR token
router.get('/attendance-qr', principalController.getDailyAttendanceQR);

router.get('/classes', auth, principalController.getClasses);
router.post('/classes', auth, principalController.createClass);
router.put('/classes/:id', auth, principalController.updateClass);
router.delete('/classes/:id', auth, principalController.deleteClass);

// Subjects CRUD
router.get('/subjects', auth, principalController.getSubjects);
router.post('/subjects', auth, principalController.createSubject);

// Timetable
router.get('/timetables', auth, principalController.getTimetables);
router.post('/timetables', auth, principalController.createTimetable);

// Syllabus Tracking
router.get('/syllabus', auth, principalController.getSyllabus);
router.post('/syllabus', auth, principalController.createSyllabus);

// Discipline Logs
router.get('/discipline', auth, principalController.getDisciplineLogs);
router.post('/discipline', auth, principalController.createDisciplineLog);

// Leave Approvals
router.get('/leaves', auth, principalController.getLeaveRequests);
router.put('/leaves/:id', auth, principalController.updateLeaveStatus);

// Students CRUD
router.get('/students', principalController.getStudents);
router.post('/students', principalController.createStudent);
router.get('/students/:id/profile', principalController.getStudentProfile);
router.put('/students/:id', principalController.updateStudent);
router.delete('/students/:id', principalController.deleteStudent);
router.post('/students/:id/promote', principalController.promoteStudent);
router.post('/students/:id/transfer', principalController.transferStudent);

// Other entities
router.get('/teachers', principalController.getTeachers);
router.get('/teachers/performance', auth, principalController.getTeacherPerformance);
router.get('/attendance', principalController.getAttendance);
router.get('/exams', principalController.getExams);
router.get('/fees', principalController.getFees);
router.get('/admissions', principalController.getAdmissions);
router.get('/staff', principalController.getStaff);
router.get('/communications', principalController.getCommunications);
router.get('/events', principalController.getEvents);

// GET specific student attendance and results
router.get('/attendance/student/:id', principalController.getStudentAttendance);
router.get('/results/student/:id', principalController.getStudentResults);

module.exports = router;
