const express = require('express');
const { userAuth } = require('../middleware/userAuth');
const Step = require('../models/step');

const router = express.Router();

// Save or update steps
router.post('/', userAuth, async (req, res) => {
  const userId = req.user._id;
  const { steps } = req.body;
  const today = new Date().toISOString().split('T')[0]; // e.g. '2025-08-01'

  try {
    const updated = await Step.findOneAndUpdate(
      { userId, date: today },
      { steps },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get last 7 days
router.get('/', userAuth, async (req, res) => {
  const userId = req.user._id;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

  try {
    const steps = await Step.find({
      userId,
      date: { $gte: sevenDaysAgo.toISOString().split('T')[0] }
    }).sort({ date: 1 });

    res.json({ success: true, data: steps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
