const express = require('express');
const router = express.Router();
const { getUserTodos, createTodo, updateTodo, editTodo, deleteTodo } = require('../controller/todoController');
const { userAuth } = require('../middleware/userAuth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const todoUploadsDir = path.join(__dirname, '..', 'uploads', 'todo');
if (!fs.existsSync(todoUploadsDir)) {
  fs.mkdirSync(todoUploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, todoUploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `todo-${Date.now()}-${Math.round(Math.random() * 1e9)}.${file.originalname.split('.').pop()}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});


const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: 'File size too large. Maximum size is 5MB.' 
      });
    }
    return res.status(400).json({ 
      success: false, 
      message: 'File upload error: ' + err.message 
    });
  } else if (err) {
    return res.status(400).json({ 
      success: false, 
      message: err.message 
    });
  }
  next();
};


router.get('/user', userAuth, getUserTodos);
router.post('/create', userAuth, upload.single('image'), handleMulterError, createTodo);
router.put('/update/:id', userAuth, updateTodo);
router.put('/edit/:id', userAuth, upload.single('image'), handleMulterError, editTodo);
router.delete('/delete/:id', userAuth, deleteTodo);



module.exports = router;