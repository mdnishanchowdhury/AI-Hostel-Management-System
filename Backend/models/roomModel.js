const { client } = require('../config/db');
const roomsCollection = client.db("smart_hostel").collection("rooms");
module.exports = roomsCollection;
