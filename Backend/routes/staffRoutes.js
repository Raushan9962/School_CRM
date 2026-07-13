const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { auth } = require('../middleware/auth');

// All staff routes require authentication
router.use(auth);

// HR Modules (Shared for all staff: Librarian, Accountant, Transport, Receptionist, etc.)
router.get('/attendance', staffController.getMyAttendance);
router.post('/attendance', staffController.markMyAttendance);
router.get('/leaves', staffController.getMyLeaves);
router.post('/leaves', staffController.applyLeave);
router.get('/salary', staffController.getMySalary);

module.exports = router;
