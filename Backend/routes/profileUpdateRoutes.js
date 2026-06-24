const express = require('express');
const router = express.Router();
const profileUpdateController = require('../controllers/profileUpdateController');
const { auth } = require('../middleware/auth'); 

// Student submits request
router.post('/requests', auth, profileUpdateController.createRequest);

// Admin/Principal fetches requests
router.get('/requests', auth, profileUpdateController.getRequests);

// Admin/Principal approves or rejects request
router.put('/requests/:id', auth, profileUpdateController.processRequest);

module.exports = router;
