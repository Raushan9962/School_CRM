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

// Admission Number auto-generation
router.get('/next-admission-no', auth, userController.getNextAdmissionNo);

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

// Profile Image Management
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

router.post('/profile-image', auth, upload.single('image'), userController.uploadProfileImage);
router.delete('/profile-image', auth, userController.removeProfileImage);

module.exports = router;
