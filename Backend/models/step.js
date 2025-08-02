const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:     { type: String, required: true }, // e.g. '2025-08-01'
  steps:    { type: Number, default: 0 }
}, { timestamps: true });

stepSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Step', stepSchema);
