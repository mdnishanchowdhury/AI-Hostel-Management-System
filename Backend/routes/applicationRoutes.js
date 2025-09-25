const express = require('express');
const { createApplication, getApplications, updateApplication, postApplicationSuggest } = require('../controllers/applicationController');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

const router = express.Router();

router.post('/', createApplication);
router.get('/', verifyToken, verifyAdmin, getApplications);
router.patch('/:id', verifyToken, verifyAdmin, updateApplication);
router.post('/suggest', postApplicationSuggest);

module.exports = router;
