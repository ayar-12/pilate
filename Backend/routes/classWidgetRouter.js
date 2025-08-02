const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { userAuth, verifyAdmin } = require('../middleware/userAuth');
const { updateClassWidget } = require('../controller/classWidgetCotroller');
const ClassWidage = require('../models/classWidage'); 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = file.fieldname === 'video' ? 'uploads/videos' : 'uploads/images';
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + '-' + file.fieldname + ext;
    cb(null, filename);
  }
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const classData = await ClassWidage.findOne();
    res.json({ success: true, data: classData ? [classData] : [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}); 

router.put('/update', userAuth, verifyAdmin, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), updateClassWidget); 

module.exports = router;
