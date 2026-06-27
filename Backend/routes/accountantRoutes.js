const express = require('express');
const router = express.Router();
const accountantController = require('../controllers/accountantController');
const { auth } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/rbac');

// All routes require Accountant role (or higher via RBAC)
router.use(auth);
router.use(authorizeRoles('Accountant', 'SuperAdmin')); // Added SuperAdmin as well to be safe

// Dashboard
router.get('/dashboard-stats', accountantController.getDashboardStats);

// Fee Collection
router.post('/fees/collect', accountantController.collectFee);
router.get('/fees/receipts', accountantController.getFeeReceipts);

// Expenses
router.post('/expenses', accountantController.addExpense);
router.get('/expenses', accountantController.getExpenses);

// Payroll
router.post('/payroll', accountantController.generatePayroll);
router.get('/payroll', accountantController.getPayrolls);

// CRM Subscription
router.post('/crm-subscription', accountantController.recordCRMSubscription);
router.get('/crm-subscription', accountantController.getCRMSubscriptions);

module.exports = router;
