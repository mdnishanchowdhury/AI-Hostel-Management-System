const { ObjectId } = require('mongodb');
const usersCollection = require('../models/userModel');
const applicationCollection = require('../models/applicationModel');

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await usersCollection.find().toArray();
        res.send(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

//  Add user
const addUser = async (req, res) => {
    try {
        const user = req.body;

        if (!user?.email) {
            return res.status(400).send({ message: "Email is required" });
        }

        const existing = await usersCollection.findOne({ email: user.email });
        if (existing) {
            return res.send({ message: 'User already exists', insertedId: null });
        }

        const result = await usersCollection.insertOne({
            ...user,
            role: user.role || "user", // default role
        });

        res.status(201).send(result);
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

//  Delete user
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid user ID" });
        }

        const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).send({ message: "User not found" });
        }

        res.send(result);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

//  Make user admin
const makeAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid user ID" });
        }

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { role: 'admin' } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send({ message: "User not found or already admin" });
        }

        res.send(result);
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

// Check if user is admin
const checkAdmin = async (req, res) => {
    try {
        const email = req.params.email;
        if (email !== req.decoded.email) {
            return res.status(403).send({ message: 'Forbidden' });
        }

        const user = await usersCollection.findOne({ email });
        res.send({ admin: user?.role === 'admin' });
    } catch (error) {
        console.error("Error checking admin:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

// user room select
const userRoomInfo = async (req, res) => {
    try {
        const email = req.query.email; //

        if (!email) {
            return res.status(400).send({ message: "Email is required" });
        }
        // application collection 
        const application = await applicationCollection.findOne({ email });
        if (!application) {
            return res.status(404).send({ message: "Application not found" });
        }
        // users collection 
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        res.send(user);
    } catch (error) {
        console.error("Error fetching user room info:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};



module.exports = { getAllUsers, addUser, deleteUser, makeAdmin, checkAdmin, userRoomInfo };
