const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Utility to seed roles (Admin setup)
router.post('/seed-roles', userController.seedRoles);

// Protected user creation route
// `auth` verifies the JWT. The controller handles the specific role hierarchy checks.
router.post('/create', auth, userController.createUser);

// Super Admin: Get all registered School Admins with full details
router.get('/school-admins', auth, userController.getAllSchoolAdmins);

// School Admin: Get all registered users for their school
router.get('/school-users', auth, userController.getSchoolUsers);

module.exports = router;
