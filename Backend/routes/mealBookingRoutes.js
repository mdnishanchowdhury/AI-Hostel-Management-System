const express = require('express');
const router = express.Router();
const { getBookingsByEmail, updateBooking, seedMealsForAllUsers, getAllBookings } = require('../controllers/mealBookingController');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.get('/', verifyToken, getBookingsByEmail);
router.get('/summary',verifyToken, verifyAdmin, getAllBookings);
router.patch('/:id', verifyToken, updateBooking);
router.post('/seed', verifyToken, verifyAdmin, seedMealsForAllUsers);

module.exports = router;
