const { ObjectId } = require('mongodb');
const applicationCollection = require('../models/applicationModel');
const usersCollection = require('../models/userModel');
const roomsCollection = require('../models/roomModel');
const admin = require('../config/firebase');
const transporter = require('../config/nodemailer');
const generatePassword = require('../utils/generatePassword');

// Create new application
const createApplication = async (req, res) => {
    try {
        const { email, name, ...rest } = req.body;

        if (!email || !name) {
            return res.status(400).send({ message: "Name and email are required" });
        }

        const existingApplication = await applicationCollection.findOne({ email });
        if (existingApplication) {
            return res.status(400).send({ message: "You have already applied!" });
        }

        const newApplication = { email, name, ...rest, createdAt: new Date() };
        const result = await applicationCollection.insertOne(newApplication);

        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Something went wrong" });
    }
};

// Get all applications
const getApplications = async (req, res) => {
    try {
        const apps = await applicationCollection.find().toArray();
        res.send(apps);
    } catch (error) {
        console.error("Error fetching applications:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

// Update application (accept/reject)
const updateApplication = async (req, res) => {
    try {
        const id = req.params.id;
        const { action } = req.body;
        if (!['accepted', 'rejected'].includes(action)) {
            return res.status(400).send({ message: "Invalid action" });
        }

        const filter = { _id: new ObjectId(id) };
        const updatedDoc = { $set: { status: action } };
        const result = await applicationCollection.updateOne(filter, updatedDoc);

        if (action === 'accepted') {
            const application = await applicationCollection.findOne(filter);
            if (!application) {
                return res.status(404).send({ message: "Application not found" });
            }

            const tempPassword = generatePassword();

            await admin.auth().createUser({
                displayName: application.name,
                image: application.imageURL,
                email: application.email,
                password: tempPassword,
            });

            await usersCollection.insertOne({
                name: application.name,
                studentId: application.studentId,
                department: application.department,
                email: application.email,
                phone: application.phone,
                fatherName: application.fatherName,
                fatherPhone: application.fatherPhone,
                selectedSeat: application.selectedSeat,
                address: application.address,
                image: application.imageURL,
                role: 'user',
            });

            await transporter.sendMail({
                from: `"Smart Hostel" <${process.env.EMAIL_USER}>`,
                to: application.email,
                subject: "Your Hostel Application Accepted",
                text: `Hello ${application.name},\n\nYour application has been accepted!\n\nEmail: ${application.email}\nPassword: ${tempPassword}\n\nLogin and update your password immediately.`,
            });
        }

        res.send(result);
    } catch (error) {
        console.error("Error updating application:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};


// Suggest seat based on preferences
const postApplicationSuggest = async (req, res) => {
    try {
        const { department, isQuiet, sleepTime, studyTime, isSmoker, cleanliness } = req.body;

        // accepted applications
        const applications = await applicationCollection.find({ status: "accepted" }).toArray();

        let bestMatch = null;
        let bestScore = -1;
        const maxScore = 8;

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

        const MATCH_THRESHOLD = 0.5;

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
};

// application
const applicationPatch = async (req, res) => {
    try {
        const { email, name, ...rest } = req.body;

        if (!email || !name) {
            return res.status(400).send({ message: "Name and email are required" });
        }

        const existingApplication = await applicationCollection.findOne({ email });

        if (!existingApplication) {
            return res.status(404).send({ message: "No application found for this email" });
        }

        if (["pending", "accepted"].includes(existingApplication.status)) {
            return res.status(400).send({
                message: `Your application is already ${existingApplication.status}`
            });
        }

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
};


module.exports = { createApplication, getApplications, updateApplication, postApplicationSuggest, applicationPatch };
