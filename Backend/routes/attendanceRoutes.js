const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { auth } = require('../middleware/auth');

router.post('/', attendanceController.createAttendance);
router.post('/scan', auth, attendanceController.scanAttendanceQR);
router.get('/', attendanceController.getAllAttendance);
router.get('/student/:studentId', attendanceController.getAttendanceByStudentId);
router.get('/:id', attendanceController.getAttendanceById);
router.put('/:id', attendanceController.updateAttendance);
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;
