const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');

router.post('/', leaveController.createLeave);
router.get('/', leaveController.getAllLeaves);
router.get('/user/:userId', leaveController.getLeavesByUserId);
router.put('/:id/status', leaveController.updateLeaveStatus);

module.exports = router;
