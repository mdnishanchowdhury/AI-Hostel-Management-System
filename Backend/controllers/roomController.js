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

module.exports = { roomsget, roomsPatch }