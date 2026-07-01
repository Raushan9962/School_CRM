const express = require('express');
const router = express.Router();
const accountantController = require('../controllers/accountantController');
const { auth } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/rbac');
const upload = require('../middleware/upload');

// All routes require Accountant role (or higher via RBAC)
router.use(auth);
router.use(authorizeRoles('Accountant', 'SuperAdmin')); // Added SuperAdmin as well to be safe

// Dashboard
router.get('/dashboard-stats', accountantController.getDashboardStats);

// Fee Collection (Old Receipts)
router.post('/fees/collect', accountantController.collectFee);
router.get('/fees/receipts', accountantController.getFeeReceipts);

// Student Fee Management (New)
router.get('/fee-structures', accountantController.getFeeStructures);
router.post('/fee-structures', accountantController.addFeeStructure);
router.put('/fee-structures/:id', accountantController.updateFeeStructure);
router.get('/student-fees', accountantController.getStudentFees);
router.post('/student-fees/assign', accountantController.assignStudentFee);
router.post('/student-fees/bulk-generate', accountantController.bulkGenerateStudentFees);

// Expenses
router.post('/expenses', accountantController.addExpense);
router.get('/expenses', accountantController.getExpenses);

// Payroll
router.post('/payroll', accountantController.generatePayroll);
router.get('/payroll', accountantController.getPayrolls);

// CRM Subscription
router.post('/crm-subscription', upload.single('receipt'), accountantController.recordCRMSubscription);
router.get('/crm-subscription', accountantController.getCRMSubscriptions);

// Vendors
router.get('/vendors', accountantController.getVendors);
router.post('/vendors', accountantController.addVendor);
router.post('/vendors/:id/pay', accountantController.payVendor);

// Scholarships & Discounts
router.get('/scholarships', accountantController.getScholarships);
router.post('/scholarships', accountantController.assignScholarship);
router.patch('/scholarships/:id/status', accountantController.updateScholarshipStatus);

// Students & Classes lookup
router.get('/students', accountantController.getStudents);
router.get('/classes', accountantController.getClasses);

module.exports = router;
