const express = require('express');
const router = express.Router();
const adminDashboardController = require('../controllers/adminDashboardController');
const { auth } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/rbac');

// Secure these routes for Super Admin only
router.get('/dashboard/stats', auth, authorizeRoles('Super Admin'), adminDashboardController.getStats);
router.get('/dashboard/schools', auth, authorizeRoles('Super Admin'), adminDashboardController.getSchoolsList);

module.exports = router;
