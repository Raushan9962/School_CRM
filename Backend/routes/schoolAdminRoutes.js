const express = require('express');
const router = express.Router();
const schoolAdminController = require('../controllers/schoolAdminController');
const { auth, restrictTo } = require('../middleware/auth');

router.get('/dashboard-stats', auth, restrictTo('School Admin', 'Principal'), schoolAdminController.getDashboardStats);

router.get('/staff-attendance', auth, restrictTo('School Admin', 'Principal'), schoolAdminController.getStaffAttendance);
router.post('/staff-attendance', auth, restrictTo('School Admin', 'Principal'), schoolAdminController.markStaffAttendance);

router.get('/leaves', auth, restrictTo('School Admin', 'Principal'), schoolAdminController.getLeaveRequests);
router.put('/leaves/:id', auth, restrictTo('School Admin', 'Principal'), schoolAdminController.updateLeaveStatus);

// Finance
router.get('/fees', auth, restrictTo('School Admin', 'Principal'), schoolAdminController.getFees);
router.post('/fees', auth, restrictTo('School Admin', 'Principal'), schoolAdminController.collectFee);
router.get('/expenses', auth, restrictTo('School Admin', 'Principal'), schoolAdminController.getExpenses);
router.post('/expenses', auth, restrictTo('School Admin', 'Principal'), schoolAdminController.addExpense);

// Transport
router.get('/routes', auth, restrictTo('School Admin', 'Principal'), schoolAdminController.getTransportRoutes);
router.post('/routes', auth, restrictTo('School Admin', 'Principal'), schoolAdminController.addTransportRoute);

module.exports = router;
