const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),          // <— key change
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) return cb(null, true);
    cb(new Error('Invalid file type. Only images and videos are allowed.'));
  },
  limits: { fileSize: 50 * 1024 * 1024, files: 2 }
});

module.exports = upload;

