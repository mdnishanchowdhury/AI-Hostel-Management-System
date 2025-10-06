const paymentsCollection = require('../models/paymentModel');
const mealBookingsCollection = require('../models/mealBookingModel'); 
const usersCollection = require('../models/userModel');

const createPayment = async (req, res) => {
    const { userName, studentId, email, month, paymentMethod, status } = req.body;

    try {
        if (!month) return res.status(400).send({ message: "Month is required" });

        //Check if payment already exists
        const existingPayment = await paymentsCollection.findOne({ email, month });
        if (existingPayment) {
            return res.status(400).send({
                message: "Payment for this month already done",
                payment: existingPayment
            });
        }

        const [year, monthNumber] = month.split("-");
        const startDate = new Date(year, monthNumber - 1, 1);
        const endDate = new Date(year, monthNumber, 1);

        const mealBookings = await mealBookingsCollection
            .find({ email, date: { $gte: startDate, $lt: endDate } })
            .toArray();

        let totalMealCost = 0;
        mealBookings.forEach(b => {
            b.meals.forEach(m => {
                if (m.booked) totalMealCost += m.price;
            });
        });

        const roomRent = 4500;
        const total = roomRent + totalMealCost;

        const payment = {
            userName,
            studentId,
            email,
            month,
            roomRent,
            mealCost: totalMealCost,
            total,
            paymentMethod: paymentMethod || "Cash",
            status: status || "Paid",
            createdAt: new Date()
        };

        await paymentsCollection.insertOne(payment);
        res.send({
            message: "Payment added successfully",
            payment
        });

    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to add payment" });
    }
};

const getAllPayments = async (req, res) => {
    try {
        const { month } = req.query; 
        let query = {};

        if(month) {
            const [year, mon] = month.split("-");
            const startDate = new Date(year, mon - 1, 1);
            const endDate = new Date(year, mon, 1);
            query.createdAt = { $gte: startDate, $lt: endDate };
        }

        const result = await paymentsCollection.find(query).toArray();
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch payments" });
    }
};


// User payments
const getPaymentsByEmail = async (req, res) => {
    const email = req.query.email;
    try {
        const result = await paymentsCollection.find({ email }).toArray();
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch user payments" });
    }
};

// user monthy payments history
const getCurrentMonthPayment = async (req, res) => {
    const email = req.query.email;
    if (!email) return res.status(400).send({ message: "Email is required" });

    try {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const payment = await paymentsCollection.findOne({
            email,
            createdAt: { $gte: startDate, $lt: endDate }
        });

        if (!payment) {
            return res.send({ message: "No payment found for this month", payment: null });
        }

        res.send({ payment });
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to fetch payment history" });
    }
};

const getCurrentMonthPaymentsSummary = async (req, res) => {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    //Current month payments per user
    const currentMonthPayments = await paymentsCollection.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate }
        }
      },
      {
        $group: {
          _id: "$email",
          totalPaid: { $sum: "$total" },
          paymentCount: { $sum: 1 },
          status: { $first: "$status" }
        }
      }
    ]).toArray();

    //All normal users
    const normalUsers = await usersCollection.find({ role: { $ne: "admin" } }).toArray();

    const totalUsers = normalUsers.length;

    const paidEmails = currentMonthPayments
      .filter(p => p.status === "Paid")
      .map(p => p._id);

    const unpaidUsers = normalUsers.filter(u => !paidEmails.includes(u.email));

    res.send({
      totalUsers,
      paidCount: paidEmails.length,
      unpaidCount: unpaidUsers.length,
      currentMonthPayments
    });

  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to fetch current month payment summary" });
  }
};

// unpaid
const getCurrentMonthUnpaidUsers = async (req, res) => {
  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const normalUsers = await usersCollection.find({ role: { $ne: "admin" } }).toArray();

    const currentMonthPayments = await paymentsCollection.find({
      createdAt: { $gte: startDate, $lt: endDate },
      status: "Paid"
    }).toArray();

    const paidEmails = currentMonthPayments.map(p => p.email);

    const unpaidUsers = normalUsers.filter(u => !paidEmails.includes(u.email));

    res.send({ unpaidUsers });

  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Failed to fetch unpaid users" });
  }
};

module.exports = { createPayment, getAllPayments, getPaymentsByEmail,getCurrentMonthPayment,getCurrentMonthPaymentsSummary,getCurrentMonthUnpaidUsers  };
