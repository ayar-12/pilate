// routes/homeRouter.js
const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const { userAuth, verifyAdmin } = require('../middleware/userAuth');
const { getHome, updateHome }   = require('../controller/homeController');

// ✅ use memoryStorage so file.buffer exists
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024 } // 200 MB
});

router.get('/', getHome);

router.put(
  '/update',
  userAuth,
  verifyAdmin,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  updateHome
);

module.exports = router;

