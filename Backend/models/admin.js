const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Admin name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Admin email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Admin password is required'],
      minlength: 6,
    },
    role: {
      type: String,
      default: 'admin',
    }
  },
  {
    timestamps: true,
  }
);



const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
