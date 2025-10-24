const { ObjectId } = require('mongodb');
const applicationCollection = require('../models/applicationModel');
const usersCollection = require('../models/userModel');
const roomsCollection = require('../models/roomModel');
const admin = require('../config/firebase');
const transporter = require('../config/nodemailer');
const generatePassword = require('../utils/generatePassword');

//  Create Apllication (Step 2)

const createApplication = async (req, res) => {
    try {
        const { email, name, ...rest } = req.body;

        if (!email || !name) {
            return res.status(400).json({ message: "Name and email are required" });
        }

        const existing = await applicationCollection.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "You have already applied!" });
        }

        const newApplication = {
            email,
            name,
            ...rest,
            status: "incomplete",
            createdAt: new Date(),
        };

        const result = await applicationCollection.insertOne(newApplication);
        res.status(201).json({ message: "Application saved as incomplete", result });
    } catch (error) {
        console.error("Create Application Error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

//  Get all applications

const getApplications = async (req, res) => {
    try {
        const apps = await applicationCollection.find().toArray();
        res.json(apps);
    } catch (error) {
        console.error("Get Applications Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//  updated application (admin)

const updateApplication = async (req, res) => {
    try {
        const id = req.params.id;
        const { action } = req.body;

        if (!['accepted', 'rejected'].includes(action)) {
            return res.status(400).json({ message: "Invalid action" });
        }

        const filter = { _id: new ObjectId(id) };
        const updatedDoc = { $set: { status: action } };
        const result = await applicationCollection.updateOne(filter, updatedDoc);

        if (action === 'accepted') {
            const application = await applicationCollection.findOne(filter);
            if (!application) {
                return res.status(404).json({ message: "Application not found" });
            }

            const tempPassword = generatePassword();

            await admin.auth().createUser({
                displayName: application.name,
                email: application.email,
                password: tempPassword,
                photoURL: application.imageURL,
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
                subject: "🎉 Hostel Application Accepted",
                text: `Hello ${application.name},\n\nYour hostel application has been accepted!\n\nLogin Credentials:\nEmail: ${application.email}\nPassword: ${tempPassword}\n\nPlease log in and change your password immediately.`,
            });
        }

        res.json({ message: `Application ${action}`, result });
    } catch (error) {
        console.error("Update Application Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//  Ai roommate Suggestion

const postApplicationSuggest = async (req, res) => {
    try {
        const {
            department,
            rateStudyTime,
            morningStudyStart,
            morningStudyEnd,
            nightStudyStart,
            nightStudyEnd,
            nightSleepStart,
            nightSleepEnd,
            isSmoker,
            cleaningPreference,
            noiseSensitivity,
        } = req.body;

        const applications = await applicationCollection.find({ status: "accepted" }).toArray();

        let bestMatch = null;
        let bestScore = -Infinity;
        const maxScore = 70;

        applications.forEach((app) => {
            let score = 0;

            // Department
            if (app.department === department) score += 5;

            // Preferred Study Time
            if (app.rateStudyTime === rateStudyTime) score += 10;
            else score -= 5;

            // Morning Study Time
            if (morningStudyStart && morningStudyEnd && app.morningStudyStart && app.morningStudyEnd) {
                const userStart = parseInt(morningStudyStart.split(":")[0], 10);
                const userEnd = parseInt(morningStudyEnd.split(":")[0], 10);
                const appStart = parseInt(app.morningStudyStart.split(":")[0], 10);
                const appEnd = parseInt(app.morningStudyEnd.split(":")[0], 10);
                const diff = Math.abs(userStart - appStart) + Math.abs(userEnd - appEnd);
                score += Math.max(0, 5 - diff);

            }

            // Night Study Time
            if (nightStudyStart && nightStudyEnd && app.nightStudyStart && app.nightStudyEnd) {
                const userStart = parseInt(nightStudyStart.split(":")[0], 10);
                const userEnd = parseInt(nightStudyEnd.split(":")[0], 10);
                const appStart = parseInt(app.nightStudyStart.split(":")[0], 10);
                const appEnd = parseInt(app.nightStudyEnd.split(":")[0], 10);
                const diff = Math.abs(userStart - appStart) + Math.abs(userEnd - appEnd);
                score += Math.max(0, 5 - diff);
            }

            // Night Sleep Time
            if (nightSleepStart && nightSleepEnd && app.nightSleepStart && app.nightSleepEnd) {
                const userStart = parseInt(nightSleepStart.split(":")[0], 10);
                const userEnd = parseInt(nightSleepEnd.split(":")[0], 10);
                const appStart = parseInt(app.nightSleepStart.split(":")[0], 10);
                const appEnd = parseInt(app.nightSleepEnd.split(":")[0], 10);
                const diff = Math.abs(userStart - appStart) + Math.abs(userEnd - appEnd);
                score += Math.max(0, 5 - diff);
            }

            // Cleaning Preference
            const cleaningScoreMap = { "always": 10, "weekly": 7, "none": 3 };
            score += (cleaningScoreMap[app.cleaningPreference] || 0);

            // Noise Sensitivity
            const noiseScoreMap = { "low": 5, "medium": 8, "high": 10 };
            score += (noiseScoreMap[app.noiseSensitivity] || 0);

            // Smoking Habit
            if (isSmoker === "no" && app.isSmoker === "no") score += 10;
            else if (isSmoker === "yes" && app.isSmoker === "yes") score += 0;

            // Highest score
            if (score > bestScore) {
                bestScore = score;
                bestMatch = app;
            }
        });

        let suggestedSeat = null;
        let matchPercent = 0;
        let matchWith = null;
        const MATCH_THRESHOLD = 0.5;

        if (bestMatch && bestScore / maxScore >= MATCH_THRESHOLD) {
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

        res.json({ suggestedSeat, matchPercent, matchWith });
    } catch (error) {
        console.error("AI Suggest Error:", error);
        res.status(500).json({ message: "Error suggesting seat" });
    }
};

//  Final Applications (Step 3)

const finalizeApplication = async (req, res) => {
    try {
        const { email, roomNumber, seatNumber } = req.body;

        const existing = await applicationCollection.findOne({ email });
        if (!existing) {
            return res.status(404).json({ message: "No application found" });
        }

        if (["pending", "accepted"].includes(existing.status)) {
            return res.status(400).json({ message: `Already ${existing.status}` });
        }

        const updateDoc = {
            $set: {
                roomNumber,
                seatNumber,
                selectedSeat: `${roomNumber}-${seatNumber}`,
                status: "pending",
                updatedAt: new Date(),
            },
        };

        const result = await applicationCollection.updateOne({ email }, updateDoc);
        res.json({ message: "Application finalized and pending approval", result });
    } catch (error) {
        console.error("Finalize Application Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = { createApplication, getApplications, updateApplication, postApplicationSuggest, finalizeApplication, };
