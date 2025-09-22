const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// const bcrypt = require('bcrypt');

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

        // Nodemailer setup
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        // JWT token generation
        app.post('/jwt', async (req, res) => {
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

        // Application apis
        app.post('/application', async (req, res) => {
            const user = { ...req.body, status: 'pending' };
            const result = await applicationCollection.insertOne(user);
            res.send(result);
        });

        app.get('/applications', verifyToken, verifyAdmin, async (req, res) => {
            const apps = await applicationCollection.find().toArray();
            res.send(apps);
        });

        app.patch('/application/:id', verifyToken, verifyAdmin, async (req, res) => {
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

        await client.db("admin").command({ ping: 1 });
        console.log("MongoDB connected successfully!");
    } finally {
        // do not close client to keep connection alive
    }
}

run().catch(console.dir);

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Server running on port ${port}`));
