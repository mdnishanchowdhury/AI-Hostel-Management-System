const { client } = require('../config/db');

const usersCollection = client.db("smart_hostel").collection("users");

module.exports = usersCollection;
