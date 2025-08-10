// routes/blogRouter.js
const express = require('express');
const { userAuth, verifyAdmin } = require('../middleware/userAuth');
const upload = require('../middleware/upload');
const {
  getAllBlogs, getSingleBlog, createBlog, updateBlog, deleteBlog,
  searchBlogs, toggleFavorite, getMyFavorites
} = require('../controller/blogControlller');

const router = express.Router();

// Public
router.get('/blogs', getAllBlogs);
router.get('/blogs/search', searchBlogs);
router.get('/blogs/:id', getSingleBlog);

// Favorites (auth)
router.put('/blogs/:id/favorite', userAuth, toggleFavorite); // <— changed to PUT and consistent
router.get('/blogs/favorites', userAuth, getMyFavorites);

// Admin
router.post(
  '/blogs',
  userAuth,
  verifyAdmin,
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]),
  createBlog
);
router.put(
  '/blogs/:id',
  userAuth,
  verifyAdmin,
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]),
  updateBlog
);
router.delete('/blogs/:id', userAuth, verifyAdmin, deleteBlog);

module.exports = router;

