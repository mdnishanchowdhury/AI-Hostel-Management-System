const express = require('express');
const { createApplication, getApplications, updateApplication, postApplicationSuggest, finalizeApplication } = require('../controllers/applicationController');
const verifyToken = require('../middlewares/verifyToken');
const verifyAdmin = require('../middlewares/verifyAdmin');

const router = express.Router();

// Create application (Step 2)
router.post('/', createApplication);

// application (Step 3)
router.patch('/', finalizeApplication);

// Get all applications (admin)
router.get('/', verifyToken, verifyAdmin, getApplications);

// Update application (approve/reject)
router.patch('/:id', verifyToken, verifyAdmin, updateApplication);

// AI roommate suggestion
router.post('/suggest', postApplicationSuggest);

module.exports = router;
