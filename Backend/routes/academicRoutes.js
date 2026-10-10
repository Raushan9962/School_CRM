const express = require('express');
const router = express.Router();
const academicController = require('../controllers/academicController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload'); // Assuming you have a multer upload middleware

// Planners
router.post('/planners', auth, upload.single('attachment'), academicController.createPlanner);
router.get('/planners', auth, academicController.getPlanners);
router.delete('/planners/:id', auth, academicController.deletePlanner);

// Periods
router.post('/periods', auth, academicController.createPeriod);
router.get('/periods', auth, academicController.getPeriods);
router.delete('/periods/:id', auth, academicController.deletePeriod);

module.exports = router;
