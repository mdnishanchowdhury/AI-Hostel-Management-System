const { ObjectId } = require('mongodb');
const roomsCollection = require('../models/roomModel')

const roomsget = async (req, res) => {
    const result = await roomsCollection.find().toArray();
    res.send(result);
}

const roomsPatch = async (req, res) => {
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
};

// add admin rooms
const roomsPost = async (req, res) => {
    try {
        const { roomNumber, hostel, capacity, booked } = req.body;

        const roomData = {
            roomNumber,
            hostel,
            capacity: capacity || [],
            booked: booked || []
        };

        const result = await roomsCollection.insertOne(roomData);
        res.status(201).send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to create room" });
    }
};
// delete room
const roomsDelete = async (req, res) => {
    const { roomId } = req.params;

    if (!ObjectId.isValid(roomId)) {
        return res.status(400).send({ message: "Invalid Room ID" });
    }

    try {
        const result = await roomsCollection.deleteOne({ _id: new ObjectId(roomId) });

        if (result.deletedCount === 1) {
            res.send({ message: "Room deleted successfully" });
        } else {
            res.status(404).send({ message: "Room not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Failed to delete room" });
    }
};

module.exports = { roomsget, roomsPatch, roomsPost, roomsDelete }