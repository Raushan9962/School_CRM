const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');

router.get('/children', parentController.getChildren);
router.get('/children/:childId', parentController.getChildProfile);
router.get('/children/:childId/attendance', parentController.getChildAttendance);
router.get('/children/:childId/fees', parentController.getChildFees);
router.get('/children/:childId/results', parentController.getChildResults);
router.get('/children/:childId/homework', parentController.getChildHomework);
router.get('/children/:childId/timetable', parentController.getChildTimetable);

module.exports = router;
