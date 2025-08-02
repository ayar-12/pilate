// models/Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  age:     Number,
  gender:  { type: String, enum: ['male','female'] },
  weight:  Number,      
  height:  Number,     
  activity:{ type: String, enum:['sedentary','light','moderate','very','extra'] },
  goal:    { type: String, enum:['maintain','lose','gain'] },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
7