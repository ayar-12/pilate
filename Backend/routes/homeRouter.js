const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');

const { userAuth, verifyAdmin } = require('../middleware/userAuth');
const { getHome, updateHome }   = require('../controller/homeController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === 'video' ? 'uploads/videos' : 'uploads/images';
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const ext      = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, filename);
  }
});
const upload = multer({ storage });


router.get('/', getHome);


router.put(
  '/update',
  userAuth,
  verifyAdmin,
  upload.fields([
    { name: 'video', maxCount: 1 }
  ]),
  updateHome
);

module.exports = router;
