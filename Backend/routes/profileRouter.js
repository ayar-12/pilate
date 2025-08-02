const express = require('express');
const { userAuth } = require('../middleware/userAuth');
const { getProfile, upsertProfile } = require('../controller/profileController');

const router = express.Router();

// Fetch profile and calculated values
router.get('/', userAuth, getProfile);

// Create or update profile data
router.post('/', userAuth, upsertProfile);

module.exports = router;
