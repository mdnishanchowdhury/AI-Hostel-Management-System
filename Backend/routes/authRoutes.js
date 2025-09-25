const express = require('express');
const { generateToken } = require('../controllers/authController');
const router = express.Router();

router.post('/jwt', generateToken);

module.exports = router;
