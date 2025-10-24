const express = require('express');
const { roomsget, roomsPatch, roomsPost, roomsDelete } = require('../controllers/roomController');

const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

router.get('/', roomsget);
router.post('/', verifyToken, verifyAdmin, roomsPost);
router.patch('/book/:roomNumber', roomsPatch);
router.delete('/:roomId', verifyToken, verifyAdmin, roomsDelete);

module.exports = router;