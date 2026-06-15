const express = require('express');
const router = express.Router();
const principalController = require('../controllers/principalController');
// const { protect, authorize } = require('../middlewares/authMiddleware'); // Optional if using auth

// GET dashboard statistics
router.get('/dashboard-stats', principalController.getDashboardStats);

// Classes CRUD
router.get('/classes', principalController.getClasses);
router.post('/classes', principalController.createClass);
router.put('/classes/:id', principalController.updateClass);
router.delete('/classes/:id', principalController.deleteClass);

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
