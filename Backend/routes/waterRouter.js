const express = require('express');
const router = express.Router();
const WaterLog = require('../models/waterLog');
const { userAuth } = require('../middleware/userAuth');

router.post('/', userAuth, async (req, res) => {
  const { amount } = req.body;
  const date = new Date().toISOString().slice(0, 10);

  try {
    const log = await WaterLog.findOneAndUpdate(
       { userId: req.user._id, date },

      { $inc: { amount }, $setOnInsert: { date } }, // ensure date is set
      { upsert: true, new: true }
    );
    res.json({ success: true, data: log });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error("WaterLog Error:", err);
    }
    
    res.status(500).json({ success: false, message: 'Failed to log water' });
  }
});


router.get('/today', userAuth, async (req, res) => {
  const date = new Date().toISOString().slice(0, 10);
  try {
    const log = await WaterLog.findOne({ userId: req.userId, date });
    res.json({
      success: true,
      total: log?.amount || 0,
      lastDrinkAt: log?.lastDrinkAt || null, // 🔥 this was missing
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});


router.post('/add', userAuth, async (req, res) => {
  const { amount } = req.body;
  const date = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const time = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  try {
    const log = await WaterLog.findOneAndUpdate(
      { userId: req.userId, date },
      { $inc: { amount }, lastDrinkAt: time },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: log });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to log water' });
  }
});



module.exports = router;
