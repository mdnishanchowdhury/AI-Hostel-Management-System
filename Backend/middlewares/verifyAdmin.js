const { client } = require('../config/db');

const verifyAdmin = async (req, res, next) => {
  const usersCollection = client.db("smart_hostel").collection("users");
  const email = req.decoded?.email;
  if (!email) return res.status(401).send({ message: 'Unauthorized' });

  const user = await usersCollection.findOne({ email });
  if (!user || user.role !== 'admin') return res.status(403).send({ message: 'Forbidden' });
  next();
};

module.exports = verifyAdmin;
