const express = require('express');
const router = express.Router();
const principalController = require('../controllers/principalController');
// const { protect, authorize } = require('../middlewares/authMiddleware'); // Optional if using auth

// GET dashboard statistics
router.get('/dashboard-stats', principalController.getDashboardStats);

// GET student list for principal dashboard
router.get('/students', principalController.getStudents);
router.get('/teachers', principalController.getTeachers);
router.get('/classes', principalController.getClasses);
router.get('/attendance', principalController.getAttendance);
router.get('/exams', principalController.getExams);
router.get('/fees', principalController.getFees);
router.get('/admissions', principalController.getAdmissions);
router.get('/staff', principalController.getStaff);
router.get('/communications', principalController.getCommunications);
router.get('/events', principalController.getEvents);

module.exports = router;
