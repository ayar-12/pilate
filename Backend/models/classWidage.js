const mongoose = require('mongoose');

const classWidageSchema = new mongoose.Schema({
   headTitle: { type: String, required: true },
  subHeadTitle: { type: String, required: true },
   span: { type: String, required: true },
  subTitle: { type: String, required: true },
  title: { type: String, required: true },
  subTitle: { type: String, required: true },
  image: {
    type: String,
   
  },
  video: {
    type: String,
 
  },
  cloudinary_id_image: {
    type: String
  },
  cloudinary_id_video: {
    type: String
  },
}, { timestamps: true });

const ClassWidage = mongoose.model('ClassWidage', classWidageSchema);
module.exports = ClassWidage;
