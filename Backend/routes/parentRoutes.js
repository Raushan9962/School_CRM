const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const { auth } = require('../middleware/auth');

router.get('/children', auth, parentController.getChildren);
router.get('/children/:childId/overview', auth, parentController.getChildOverview);
router.get('/children/:childId', auth, parentController.getChildProfile);
router.get('/children/:childId/attendance', auth, parentController.getChildAttendance);
router.get('/children/:childId/fees', auth, parentController.getChildFees);
router.get('/children/:childId/results', auth, parentController.getChildResults);
router.get('/children/:childId/homework', auth, parentController.getChildHomework);
router.get('/children/:childId/timetable', auth, parentController.getChildTimetable);

module.exports = router;
