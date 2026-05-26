const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

router.get('/plans', subscriptionController.getAllPlans);

module.exports = router;
