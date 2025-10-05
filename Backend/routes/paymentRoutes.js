const express = require('express');
const router = express.Router();
const { createPayment, getAllPayments, getPaymentsByEmail, getCurrentMonthPayment, getCurrentMonthPaymentsSummary, getCurrentMonthUnpaidUsers } = require('../controllers/paymentController');

// ➕ নতুন payment create করা (meal bookings থেকে auto calculate) done
router.post('/', createPayment); 

// 📄 সব payment দেখানো (admin panel)
router.get('/', getAllPayments);

// 🔍 নির্দিষ্ট user এর payment (email দিয়ে)
router.get('/user', getPaymentsByEmail);

// user monthly history
router.get('/current-month', getCurrentMonthPayment);

// ➕ Current month payment summary (admin only)
router.get('/summary/current-month', getCurrentMonthPaymentsSummary);

// unpaid
router.get("/unpaid", getCurrentMonthUnpaidUsers);

module.exports = router;
