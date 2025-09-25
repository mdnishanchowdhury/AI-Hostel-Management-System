const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const { roomsget, roomsPatch } = require('./controllers/roomController');
const { postApplicationSuggest } = require('./controllers/applicationController');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connect
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/applications', applicationRoutes);
app.use('/applications', postApplicationSuggest);

// routes room
app.use('/rooms', roomsget);
app.use('/rooms', roomsPatch)

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Server running on port ${port}`));
