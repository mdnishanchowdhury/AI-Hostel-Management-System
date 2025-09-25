const { roomsget, roomsPatch } = require('../controllers/roomController');

const router = express.Router();
router.get('/', roomsget);
router.patch('/book/:roomNumber', roomsPatch);

module.exports = router;