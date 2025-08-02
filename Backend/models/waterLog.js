const mongoose = require('mongoose');

const waterLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: String, required: true }, // "YYYY-MM-DD"
  lastDrinkAt: { type: String, default: '' }, // "HH:mm"
}, { timestamps: true }); // adds createdAt, updatedAt

module.exports = mongoose.model('WaterLog', waterLogSchema);
