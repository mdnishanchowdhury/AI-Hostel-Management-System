const jwt = require('jsonwebtoken');

const generateToken = (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
  res.send({ token });
};

module.exports = { generateToken };
