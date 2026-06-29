const express = require('express');
const router = express.Router();
const superAdminController = require('../controllers/superAdminController');
const { auth } = require('../middleware/auth');

// Dashboard overview stats
router.get('/dashboard',              auth, superAdminController.getDashboardStats);

// Revenue graph data (last 12 months)
router.get('/revenue/monthly',        auth, superAdminController.getMonthlyRevenue);

// Schools expiring soon (within 30 days)
router.get('/expiring-soon',          auth, superAdminController.getExpiringSoon);

// Transactions — full CRUD
router.get('/transactions',           auth, superAdminController.getTransactions);
router.post('/transactions',          auth, superAdminController.createTransaction);
router.patch('/transactions/:id/status', auth, superAdminController.updateTransactionStatus);
router.delete('/transactions/:id',    auth, superAdminController.deleteTransaction);

// Schools subscription management
router.get('/schools',                auth, superAdminController.getSchools);
router.patch('/schools/:id/subscription', auth, superAdminController.updateSchoolSubscription);

// Revenue report
router.get('/revenue/report',         auth, superAdminController.getRevenueReport);

// All users (grouped by role)
router.get('/users',                  auth, superAdminController.getAllUsers);

// Settings
router.get('/settings',               auth, superAdminController.getPlatformSettings);
router.put('/settings',               auth, superAdminController.updatePlatformSettings);

// Plans
router.get('/plans',                  auth, superAdminController.getPlans);
router.put('/plans/:id',              auth, superAdminController.updatePlan);

// Reminders
router.post('/reminders/send',        auth, superAdminController.sendReminders);

module.exports = router;

