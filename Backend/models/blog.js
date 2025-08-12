const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long']
  },
  description: {
    type: String,
    required: [true, 'Blog description is required'],
    trim: true
  },
    favorites: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    default: []
  },
  image: {
    type: String,
    required: [true, 'Blog image is required']
  },
  video: {
    type: String,
    required: [true, 'Blog video is required']
  },
  cloudinary_id_image: {
    type: String
  },
  cloudinary_id_video: {
    type: String
  },
 
}, {
  timestamps: true
});


blogSchema.index({ title: 'text', description: 'text' });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
