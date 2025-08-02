const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  preferredDate: { type: Date },
  preferredTime: { type: String },
  notes: { type: String, maxlength: 500 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Consultation', consultationSchema);
