const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const studentRoutes = require('./studentRoutes');
const teacherRoutes = require('./teacherRoutes');
const classRoutes = require('./classRoutes');
const subjectRoutes = require('./subjectRoutes');
const attendanceRoutes = require('./attendanceRoutes');
const feeRoutes = require('./feeRoutes');
const examRoutes = require('./examRoutes');
const homeworkRoutes = require('./homeworkRoutes');
const resultRoutes = require('./resultRoutes');
const courseRoutes = require('./courseRoutes');
const lectureRoutes = require('./lectureRoutes');
const notificationRoutes = require('./notificationRoutes');
const timetableRoutes = require('./timetableRoutes');
const busRoutes = require('./busRoutes');
const hostelRoomRoutes = require('./hostelRoomRoutes');
const bookRoutes = require('./bookRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const eventRoutes = require('./eventRoutes');
const certificateRoutes = require('./certificateRoutes');

// API routes mapping
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/classes', classRoutes);
router.use('/subjects', subjectRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/fees', feeRoutes);
router.use('/exams', examRoutes);
router.use('/homeworks', homeworkRoutes);
router.use('/results', resultRoutes);
router.use('/courses', courseRoutes);
router.use('/lectures', lectureRoutes);
router.use('/notifications', notificationRoutes);
router.use('/timetables', timetableRoutes);
router.use('/buses', busRoutes);
router.use('/hostel-rooms', hostelRoomRoutes);
router.use('/books', bookRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/events', eventRoutes);
router.use('/certificates', certificateRoutes);

module.exports = router;
