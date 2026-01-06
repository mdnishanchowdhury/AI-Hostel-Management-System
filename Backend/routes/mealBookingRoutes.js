const express = require('express');
const router = express.Router();
const { getBookingsByEmail, updateBooking, seedMealsForAllUsers, getAllBookings, getMonthlyMealsHistory, getUserMealsHistory, checkMonthSeeded } = require('../controllers/mealBookingController');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.get('/', verifyToken, getBookingsByEmail);
router.get('/user-history', verifyToken, getUserMealsHistory);
router.patch('/:id', verifyToken, updateBooking);

// adimn
router.post('/seed', verifyToken, verifyAdmin, seedMealsForAllUsers);
router.get('/summary', verifyToken, verifyAdmin, getAllBookings);
router.get('/monthly-history', verifyToken, verifyAdmin, getMonthlyMealsHistory);

// router.post('/seed', verifyToken, verifyAdmin, seedMealsForAllUsers);
router.get('/check-month', verifyToken, verifyAdmin, checkMonthSeeded);

module.exports = router;
