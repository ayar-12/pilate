const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const exists = await Newsletter.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Already subscribed' });

    await Newsletter.create({ email });
    res.status(200).json({ message: 'Subscribed successfully' });
  } catch (err) {
    console.error('Subscribe error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
