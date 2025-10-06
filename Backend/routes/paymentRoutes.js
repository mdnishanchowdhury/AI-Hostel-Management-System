const express = require('express');
const router = express.Router();
const { createPayment, getAllPayments, getPaymentsByEmail, getCurrentMonthPayment, getCurrentMonthPaymentsSummary, getCurrentMonthUnpaidUsers } = require('../controllers/paymentController');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

// payment create
router.post('/',verifyToken,verifyAdmin, createPayment); 

// All payment list
router.get('/',verifyToken,verifyAdmin, getAllPayments);

// get payment email check 
router.get('/user',verifyToken, getPaymentsByEmail);

// user monthly history
router.get('/current-month',verifyToken,verifyAdmin, getCurrentMonthPayment);

// Current month payment summary
router.get('/summary/current-month',verifyToken,verifyAdmin, getCurrentMonthPaymentsSummary);

// unpaid
router.get("/unpaid",verifyToken,verifyAdmin, getCurrentMonthUnpaidUsers);

module.exports = router;
