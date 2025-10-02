const mealBookingsCollection = require('../models/mealBookingModel');
const { ObjectId } = require('mongodb'); // ✅ import ObjectId একবারে
const mealTypes = [
    { type: "Breakfast", price: 50 },
    { type: "Lunch", price: 100 },
    { type: "Dinner", price: 120 },
];

// Get bookings by email
const getBookingsByEmail = async (req, res) => {
    const email = req.query.email;
    if (!email) return res.status(400).send({ message: "Email is required" });
    try {
        const bookings = await mealBookingsCollection
            .find({ email })
            .sort({ date: 1 })
            .toArray();
        res.send(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

// Update meals
const updateBooking = async (req, res) => {
    const id = req.params.id;
    const meals = req.body.meals;
    try {
        const result = await mealBookingsCollection.findOneAndUpdate(
            { _id: new ObjectId(id) }, // ✅ ঠিক করা
            { $set: { meals } },
            { returnDocument: 'after' }
        );
        res.send(result.value);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

// Seed meals for all users (admin)
const seedMealsForAllUsers = async (req, res) => {
    const usersCollection = require('../models/userModel');
    try {
        const users = await usersCollection.find().toArray();
        const today = new Date();

        for (const user of users) {
            const email = user.email;

            // Skip if already has bookings
            const existing = await mealBookingsCollection.findOne({ email });
            if (existing) continue;

            const bookings = Array.from({ length: 30 }, (_, i) => {
                const date = new Date();
                date.setDate(today.getDate() + i + 1);
                return {
                    email,
                    date,
                    meals: mealTypes.map((meal) => ({ ...meal, booked: true })),
                };
            });
            await mealBookingsCollection.insertMany(bookings);
        }

        res.send({ message: "All users' meals seeded successfully." });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

// get all bookings
const getAllBookings = async (req, res) => {
    try {
        let targetDate = req.query.date ? new Date(req.query.date) : new Date();
        targetDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(targetDate);
        nextDay.setDate(targetDate.getDate() + 1);

        // Filter bookings
        const bookings = await mealBookingsCollection
            .find({ date: { $gte: targetDate, $lt: nextDay } })
            .toArray();

        // booked/canceled
        const userList = bookings.map(b => ({
            email: b.email,
            bookedMeals: b.meals.filter(m => m.booked).map(m => m.type),
            canceledMeals: b.meals.filter(m => !m.booked).map(m => m.type)
        }));

        // Total summary
        const totalSummary = { Breakfast: 0, Lunch: 0, Dinner: 0, total: 0 };
        bookings.forEach(b => {
            b.meals.forEach(m => {
                if (m.booked) {
                    totalSummary[m.type] += 1;
                    totalSummary.total += m.price;
                }
            });
        });

        res.send({ date: targetDate.toDateString(), userList, totalSummary });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

module.exports = { getBookingsByEmail, updateBooking, seedMealsForAllUsers, getAllBookings };
