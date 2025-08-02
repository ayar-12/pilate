const express = require('express');
const { newAdmin } = require('../controller/adminController');
const { verifyAdmin } = require('../middleware/userAuth');
const User = require('../models/user');

const router = express.Router();

// Allow creating new admin only when setting up
router.post('/newadmin', newAdmin); // ✅ fixed

// Admin-only routes
router.get('/users', verifyAdmin, async (req, res) => {
  const users = await User.find().select('-password');
  return res.json({ success: true, users });
});

router.get('/users/:id', verifyAdmin, async (req, res) => {
  const u = await User.findById(req.params.id).select('-password');
  if (!u) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: u });
});

module.exports = router;
