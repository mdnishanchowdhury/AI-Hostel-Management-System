const { client } = require("../config/db");

const paymentsCollection = client.db("smart_hostel").collection("payments");
module.exports = paymentsCollection;
