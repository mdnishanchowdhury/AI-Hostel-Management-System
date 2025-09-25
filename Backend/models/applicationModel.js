const { client } = require('../config/db');

const applicationCollection = client.db("smart_hostel").collection("application");

module.exports = applicationCollection;
