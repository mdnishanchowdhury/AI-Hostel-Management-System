const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const roomRouters = require('./routes/roomRouters');
const mealBookingRoutes = require('./routes/mealBookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const port = process.env.PORT || 5000;


/* 🔥 MUST for SSLCommerz */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ FIX

// MongoDB connect
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/applications', applicationRoutes);

// routes room
app.use('/rooms', roomRouters);

// Routes
app.use("/bookings", mealBookingRoutes);

// payments
app.use('/payments', paymentRoutes);

app.get('/', (req, res) => res.send('hostel management system'));

app.listen(port, () => console.log(`Server running on port ${port}`));

