const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Firebase Admin SDK
var admin = require("firebase-admin");
var serviceAccount = require("../Backend/firebase-service-account.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// MongoDB setup
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_BD}:${process.env.USER_PASS}@cluster0.h2pknmg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.use(cors());
app.use(express.json());

async function run() {
    try {
        await client.connect();
        const usersCollection = client.db("smart_hostel").collection("users");
        const applicationCollection = client.db("smart_hostel").collection("application");
        const roomsCollection = client.db("smart_hostel").collection("rooms");

        // Nodemailer setup
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // JWT token generation
        app.post('/auth/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
            res.send({ token });
        });

        // Verify JWT token middleware
        const verifyToken = (req, res, next) => {
            const authHeader = req.headers.authorization;
            if (!authHeader) return res.status(401).send({ message: 'Unauthorized' });

            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
                if (err) return res.status(401).send({ message: 'Unauthorized' });
                req.decoded = decoded;
                next();
            });
        };

        // Verify Admin middleware
        const verifyAdmin = async (req, res, next) => {
            const email = req.decoded.email;
            const user = await usersCollection.findOne({ email });
            if (!user || user.role !== 'admin') return res.status(403).send({ message: 'Forbidden' });
            next();
        };

        // USERS APIs
        app.get('/users', verifyToken, verifyAdmin, async (req, res) => {
            const users = await usersCollection.find().toArray();
            res.send(users);
        });

        app.post('/users', async (req, res) => {
            const user = req.body;
            const existing = await usersCollection.findOne({ email: user.email });
            if (existing) return res.send({ message: 'User already exists', insertedId: null });
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        app.delete('/users/:id', verifyToken, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        app.patch('/users/admin/:id', verifyToken, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const result = await usersCollection.updateOne(
                { _id: new ObjectId(id) },
                { $set: { role: 'admin' } }
            );
            res.send(result);
        });

        app.get('/users/admin/:email', verifyToken, async (req, res) => {
            const email = req.params.email;
            if (email !== req.decoded.email) return res.status(403).send({ message: 'Forbidden' });
            const user = await usersCollection.findOne({ email });
            res.send({ admin: user?.role === 'admin' });
        });

        // application
        app.post('/applications', async (req, res) => {
            try {
                const { email, name, ...rest } = req.body;

                if (!email || !name) {
                    return res.status(400).send({ message: "Name and email are required" });
                }

                // Check if email already applied
                const existingApplication = await applicationCollection.findOne({ email });
                if (existingApplication) {
                    return res.status(400).send({ message: "You have already applied!" });
                }

                // Insert new application
                const newApplication = { email, name, ...rest, createdAt: new Date() };
                const result = await applicationCollection.insertOne(newApplication);

                res.status(201).send(result);
            } catch (error) {
                console.error(error);
                res.status(500).send({ message: "Something went wrong" });
            }
        });

        // Step 2
        app.patch('/applications', async (req, res) => {
            try {
                const { email, name, ...rest } = req.body;

                if (!email || !name) {
                    return res.status(400).send({ message: "Name and email are required" });
                }

                // check if application exists
                const existingApplication = await applicationCollection.findOne({ email });

                if (!existingApplication) {
                    return res.status(404).send({ message: "No application found for this email" });
                }

                // pending or accepted 
                if (["pending", "accepted"].includes(existingApplication.status)) {
                    return res.status(400).send({
                        message: `Your application is already ${existingApplication.status}`
                    });
                }

                // update status to pending
                const updateDoc = {
                    $set: {
                        ...rest,
                        name,
                        status: "pending",
                        updatedAt: new Date(),
                    },
                };

                const result = await applicationCollection.updateOne(
                    { email },
                    updateDoc
                );

                res.status(200).send({ message: "Application moved to pending", result });
            } catch (error) {
                console.error("Error updating application:", error);
                res.status(500).send({ message: "Internal Server Error" });
            }
        });

        // application
        app.get('/applications', verifyToken, verifyAdmin, async (req, res) => {
            const apps = await applicationCollection.find().toArray();
            res.send(apps);
        });

        app.patch('/applications/:id', verifyToken, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const { action } = req.body; // accepted | rejected
            const filter = { _id: new ObjectId(id) };
            const updatedDoc = { $set: { status: action } };
            const result = await applicationCollection.updateOne(filter, updatedDoc);

            if (action === 'accepted') {
                const application = await applicationCollection.findOne(filter);
                const tempPassword = Math.random().toString(36).slice(-8);

                // Firebase Auth create user
                await admin.auth().createUser({
                    email: application.email,
                    password: tempPassword,
                    displayName: application.name
                });

                // Save to MongoDB users collection
                await usersCollection.insertOne({
                    name: application.name,
                    email: application.email,
                    role: 'user'
                });

                // Send email
                await transporter.sendMail({
                    from: `"Smart Hostel" <${process.env.EMAIL_USER}>`,
                    to: application.email,
                    subject: "Your Hostel Application Accepted",
                    text: `Hello ${application.name},\n\nYour application has been accepted!\n\nEmail: ${application.email}\nPassword: ${tempPassword}\n\nLogin and update your password immediately.`
                });
            }
            res.send(result);
        });
        // application end

        // room apis new
        app.get('/rooms', async (req, res) => {
            const result = await roomsCollection.find().toArray();
            res.send(result);
        })

        app.patch('/rooms/book/:roomNumber', async (req, res) => {
            const { roomNumber } = req.params;
            const { seatNumber } = req.body;

            try {
                const result = await roomsCollection.updateOne(
                    { roomNumber },
                    { $push: { booked: seatNumber } }
                );
                res.send(result);
            } catch (err) {
                console.error(err);
                res.status(500).send({ message: "Failed to book seat" });
            }
        });
        // room end

        // Suggest seat based on preferences
        app.post("/applications/suggest", async (req, res) => {
            try {
                const { department, isQuiet, sleepTime, studyTime, isSmoker, cleanliness } = req.body;

                // accepted applications
                const applications = await applicationCollection.find({ status: "accepted" }).toArray();

                let bestMatch = null;
                let bestScore = -1;
                const maxScore = 8; // total similarity score

                applications.forEach((app) => {
                    let score = 0;

                    // Department match
                    if (app.department === department) score += 2;

                    if (app.isQuiet === isQuiet) score += 1;
                    if (app.isSmoker === isSmoker) score += 2;

                    const appSleepHour = parseInt(app.sleepTime.split(":")[0]);
                    const formSleepHour = parseInt(sleepTime.split(":")[0]);
                    const sleepDiff = Math.min(Math.abs(appSleepHour - formSleepHour), 4);
                    score += Math.max(0, 1 - sleepDiff / 4);

                    const appStudyHour = parseInt(app.studyTime.split(":")[0]);
                    const formStudyHour = parseInt(studyTime.split(":")[0]);
                    const studyDiff = Math.min(Math.abs(appStudyHour - formStudyHour), 4);
                    score += Math.max(0, 1 - studyDiff / 4);

                    const cleanDiff = Math.abs(parseInt(app.cleanliness) - parseInt(cleanliness));
                    score += Math.max(0, 1 - cleanDiff / 4); // max 1 point

                    if (score > bestScore) {
                        bestScore = score;
                        bestMatch = app;
                    }
                });

                let suggestedSeat = null;
                let matchPercent = 0;
                let matchWith = null;

                const MATCH_THRESHOLD = 0.5; // 50%

                // Only suggest seat 
                if (bestMatch && (bestScore / maxScore) >= MATCH_THRESHOLD) {
                    const room = await roomsCollection.findOne({ roomNumber: bestMatch.roomNumber });
                    if (room) {
                        const availableSeat = room.capacity.find(seat => !room.booked.includes(seat));
                        if (availableSeat) {
                            suggestedSeat = `${room.roomNumber}-${availableSeat}`;
                            matchPercent = Math.round((bestScore / maxScore) * 100);
                            matchWith = bestMatch.name;
                        }
                    }
                }

                res.send({
                    suggestedSeat,
                    matchWith,
                    matchPercent,
                });

            } catch (error) {
                console.error(error);
                res.status(500).send({ message: "Error suggesting seat" });
            }
        });
        // Ai suggest end


        await client.db("admin").command({ ping: 1 });
        console.log("MongoDB connected successfully!");
    } finally {
        // do not close client to keep connection alive
    }
}

run().catch(console.dir);
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Server running on port ${port}`));
