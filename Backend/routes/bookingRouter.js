const express = require('express');
const { userAuth, verifyAdmin } = require('../middleware/userAuth');
const {
  newBooking,
  userBooking,
  bookinSesstion,
  updateUser,
  getCourseById,
  cancelBooking,
  getBookingStats,
  getDailyBookingStats
} = require('../controller/bookingController');

const router = express.Router();


router.post('/new-booking', newBooking);
router.get('/courses/:id', getCourseById);
router.get('/user-booked', userAuth, userBooking);
router.put('/user-booking-update', userAuth, updateUser);
router.put('/cancel/:bookingId', userAuth, cancelBooking);
router.get('/booking-sesstion', verifyAdmin, bookinSesstion);
router.get('/stats', verifyAdmin, getBookingStats);
router.get('/stats/daily', verifyAdmin, getDailyBookingStats);

router.get('/user-booked-admin', verifyAdmin, async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  try {
    const bookings = await require('../models/booking').find({ userEmail: email }).sort({ bookingDate: -1 });
    res.json({ success: true, data: bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings', error: err.message });
  }
});

module.exports = router;