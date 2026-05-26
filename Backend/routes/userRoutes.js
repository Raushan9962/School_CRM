const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Utility to seed roles (Admin setup)
router.post('/seed-roles', userController.seedRoles);

// Protected user creation route
// `auth` verifies the JWT. The controller handles the specific role hierarchy checks.
router.post('/create', auth, userController.createUser);

module.exports = router;
