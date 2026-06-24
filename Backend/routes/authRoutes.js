const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth'); // Import auth middleware

// Public Routes
router.post('/login', authController.login);

// Protected Routes
// Apply the 'auth' middleware to protect this route
router.post('/changepassword', auth, authController.changePassword);

// Forgot Password Flow
router.post('/verify-email', authController.verifyEmail);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
