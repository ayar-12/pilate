const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'home  title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long']
  },
  subTitle: {
    type: String,
    required: [true, 'home sub title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long']
  },
  description: {
    type: String,
    required: [true, 'home description is required'],
    trim: true
  },
  button1: {
    type: String,
    required: [true, 'home button 1 is required'],
    trim: true,
    
  },
  button2: {
    type: String,
    required: [true, 'Home button 2 is required'],
    trim: true,
   
  },

  
  button3: {
    type: String,
    required: [true, 'Home button 3 is required'],
    trim: true,
   
  },

  hTitle1: {
    type: String,
    required: [true, 'Home H1 is required'],
    trim: true,
   
  },
  hSubTitle1: {
    type: String,
    default: 'Strength & control',
    trim: true,
   
  },
  hTitle2: {
    type: String,
    default: 'Mind-Body',
    trim: true,
   
  },
  hSubTitle2: {
    type: String,
    default: 'Balance & breathing',
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long']
  },
  
  videoDocumantion: {
    type: String,
    default: 'Discover the winning edge with our comprehensive pilates training programs',
    trim: true,
  },

  videoTitle: {
    type: String,
    default: 'Discover the winning edge with our comprehensive pilates training programs',
    trim: true,
  },

videoHome: {
  type: String,
  default: '',
  trim: true
},
  cloudinary_id_image: {
    type: String
  },
  cloudinary_id_video: {
    type: String
  },
  isFavorite: { type: Boolean, default: false }
}, {
  timestamps: true
});


homeSchema.index({ title: 'text', description: 'text' });

const Home = mongoose.model('Home', homeSchema);

module.exports = Home;
