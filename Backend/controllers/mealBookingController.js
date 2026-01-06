const mealBookingsCollection = require('../models/mealBookingModel');
const { ObjectId } = require('mongodb');
const mealTypes = [
    { type: "Breakfast", price: 15 },
    { type: "Lunch", price: 50 },
    { type: "Dinner", price: 50 },
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
            { _id: new ObjectId(id) },
            { $set: { meals } },
            { returnDocument: 'after' }
        );
        res.send(result.value);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

// Seed meals for all users
const seedMealsForAllUsers = async (req, res) => {
    const { month, year } = req.body; // month: 1-12
    if (!month || !year) {
        return res.status(400).send({ message: "Month & Year required" });
    }

    try {
        const usersCollection = require('../models/userModel');
        const users = await usersCollection.find({ role: { $ne: "admin" } }).toArray();

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1); // next month first day

        for (const user of users) {
            const email = user.email;

            const exists = await mealBookingsCollection.findOne({
                email,
                date: { $gte: startDate, $lt: endDate }
            });
            if (exists) continue;

            const bookings = [];
            const tempDate = new Date(startDate);

            while (tempDate < endDate) {
                bookings.push({
                    email,
                    date: new Date(tempDate),
                    meals: mealTypes.map(m => ({ ...m, booked: true }))
                });
                tempDate.setDate(tempDate.getDate() + 1);
            }

            if (bookings.length > 0) {
                await mealBookingsCollection.insertMany(bookings);
            }
        }

        res.send({ message: "Meals seeded successfully for selected month only." });

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



// Get monthly summary for all users
const getMonthlyMealsHistory = async (req, res) => {
    try {
        const { month, year } = req.query;
        if (!month || !year) return res.status(400).send({ message: "Month and Year required" });

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const bookings = await mealBookingsCollection
            .find({ date: { $gte: startDate, $lt: endDate } })
            .sort({ date: 1 })
            .toArray();

        const userHistory = {};

        bookings.forEach(b => {
            if (!userHistory[b.email]) {
                userHistory[b.email] = { daily: {}, totalMeals: 0, totalPrice: 0 };
            }

            const day = b.date.toISOString().split('T')[0];
            if (!userHistory[b.email].daily[day]) {
                userHistory[b.email].daily[day] = { Breakfast: 0, Lunch: 0, Dinner: 0, total: 0 };
            }

            b.meals.forEach(m => {
                if (m.booked) {
                    userHistory[b.email].daily[day][m.type] += 1;
                    userHistory[b.email].daily[day].total += m.price;
                    userHistory[b.email].totalMeals += 1;
                    userHistory[b.email].totalPrice += m.price;
                }
            });
        });

        const result = Object.keys(userHistory).map(email => ({
            email,
            ...userHistory[email]
        }));

        res.send(result);

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

// Get user monthly meals history
const getUserMealsHistory = async (req, res) => {
    try {
        const email = req.query.email;
        const month = req.query.month;
        if (!email) return res.status(400).send({ message: "Email is required" });
        if (!month) return res.status(400).send({ message: "Month is required" });

        const [year, monthNumber] = month.split("-");
        const startDate = new Date(year, monthNumber - 1, 1);
        const endDate = new Date(year, monthNumber, 1);

        // Fetch bookings
        const bookings = await mealBookingsCollection
            .find({ email, date: { $gte: startDate, $lt: endDate } })
            .sort({ date: 1 })
            .toArray();

        let totalMeals = 0;
        let totalPrice = 0;
        const daily = {};

        bookings.forEach(b => {
            const day = b.date.toISOString().slice(0, 10);
            let dayTotal = 0;
            const counts = { Breakfast: 0, Lunch: 0, Dinner: 0 };

            b.meals.forEach(m => {
                if (m.booked) {
                    counts[m.type] = 1;
                    dayTotal += m.price;
                    totalMeals += 1;
                    totalPrice += m.price;
                }
            });

            daily[day] = { ...counts, total: dayTotal };
        });

        res.send({ totalMeals, totalPrice, daily });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
};



// // GET: check if month is already seeded
const checkMonthSeeded = async (req, res) => {
    const { month, year } = req.query;
    if (!month || !year) {
        return res.status(400).send({ message: "Month & Year required" });
    }

    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);

        const existing = await mealBookingsCollection.findOne({
            date: { $gte: startDate, $lt: endDate }
        });

        res.send({ seeded: Boolean(existing) });
    } catch (err) {
        console.error(err);
        res.status(500).send({ seeded: false });
    }
};


module.exports = { getBookingsByEmail, updateBooking, seedMealsForAllUsers, getAllBookings, getMonthlyMealsHistory, getUserMealsHistory, checkMonthSeeded };

