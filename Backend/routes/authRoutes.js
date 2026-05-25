const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth'); // Import auth middleware

// Public Routes
router.post('/sendotp', authController.sendOTP);
router.post('/signup', authController.signUp);
router.post('/login', authController.login);

// Protected Routes
// Apply the 'auth' middleware to protect this route
router.post('/changepassword', auth, authController.changePassword);

module.exports = router;
