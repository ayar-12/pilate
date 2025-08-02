const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  userName: String,
  userEmail: String,
  userPhone: Number,
  selectedTime: { type: String, default: 'TBA' },
  courseName: { type: String, default: '' },
  coursePrice: { type: Number, default: 0 },
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, default: 'pending' },
  courseDetails: { type: Object, default: {} }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
