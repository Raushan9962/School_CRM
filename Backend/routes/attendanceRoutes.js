const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/', attendanceController.markAttendance);
router.get('/', attendanceController.getAllAttendance);
router.get('/student/:studentId', attendanceController.getAttendanceByStudent);
router.put('/:id', attendanceController.updateAttendance);
router.delete('/:id', attendanceController.deleteAttendance);

module.exports = router;
