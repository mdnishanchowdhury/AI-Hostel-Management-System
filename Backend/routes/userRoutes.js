const express = require('express');
const {
  getAllUsers, addUser, deleteUser, makeAdmin, checkAdmin
} = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

const router = express.Router();

router.get('/', verifyToken, verifyAdmin, getAllUsers);
router.post('/', addUser);
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);
router.patch('/admin/:id', verifyToken, verifyAdmin, makeAdmin);
router.get('/admin/:email', verifyToken, checkAdmin);

module.exports = router;
