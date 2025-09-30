const admin = require("firebase-admin");
// const serviceAccount = require("../firebase-service-account.json");
const decodedKey = Buffer.from(process.env.FB_SERVICE_KEY, 'base64').toString('utf8')
const serviceAccount = JSON.parse(decodedKey);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
