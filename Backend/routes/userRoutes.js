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

// School Admin: Get detailed lists
router.get('/school-students', auth, userController.getSchoolStudents);
router.get('/school-teachers', auth, userController.getSchoolTeachers);
router.get('/school-parents', auth, userController.getSchoolParents);

// Specialized Staff (Phase 2)
router.get('/school-accountants', auth, userController.getSchoolAccountants);
router.get('/school-librarians', auth, userController.getSchoolLibrarians);
router.get('/school-transport-managers', auth, userController.getSchoolTransportManagers);

// School Admin: Attendance Management
router.get('/school-attendance', auth, userController.getSchoolAttendance);
router.post('/school-attendance', auth, userController.markSchoolAttendance);

// School Admin: Fees History Management
router.get('/school-fees-history', auth, userController.getSchoolFeesHistory);
router.post('/school-fees', auth, userController.addSchoolFee);

module.exports = router;
