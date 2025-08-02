// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true, unique: true },
  phone:   { type: String, required: true },
  age:     String,
  image:   String,
  avatar: { type: String }, // ✅ add this

  password:{ type: String, required: true },
  verifyOtp:            String,
  verifyOtpExpireAt:    Number,
  isAccountVerified:    { type: Boolean, default: false },
  resetOtp:             String,
  resetOtpExpireAt:     String,
    cloudinary_id_image: {
    type: String
  },
  cloudinary_id_avatar: {
    type: String
  },
  role: { type: String, default: 'user' },
}, { timestamps: true });

// Register as 'User' (capitalized is the convention)
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
