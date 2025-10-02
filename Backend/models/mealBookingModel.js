const { client } = require('../config/db');

const mealBookingCollection = client.db("smart_hostel").collection("mealBookings");

module.exports = mealBookingCollection;
