const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Course price is required'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String,
    required: [true, 'Course image is required']
  },
  video: {
    type: String,
   
  },
  couchName: {
    type: String,
    required: [true, 'Coach name is required'],
    trim: true
  },
  timing: [{
    date: {
    type: String,
      required: true
  },
    time: {
    type: String,
      required: true
    }
  }],
  cloudinary_id_image: {
    type: String
  },
  cloudinary_id_video: {
    type: String
  }
}, {
  timestamps: true
});


courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ couchName: 1 });

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
