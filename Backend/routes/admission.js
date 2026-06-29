const express = require('express');
const router = express.Router();
const admissionController = require('../controllers/admissionController');

router.post('/apply', admissionController.applyForAdmission);
router.get('/requests', admissionController.getAdmissionRequests);
router.post('/approve/:id', admissionController.approveAdmission);
router.get('/invoice/:id', admissionController.getInvoice);
router.post('/pay', admissionController.processPayment);

router.get('/fee-structures', admissionController.getFeeStructures);
router.post('/fee-structures', admissionController.createFeeStructure);
router.delete('/fee-structures/:id', admissionController.deleteFeeStructure);

module.exports = router;
