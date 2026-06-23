const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');

router.post('/', complaintController.createComplaint);
router.get('/', complaintController.getAllComplaints);
router.get('/user/:userId', complaintController.getComplaintsByUserId);
router.put('/:id/status', complaintController.updateComplaintStatus);

module.exports = router;
