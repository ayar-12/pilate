const express = require('express');
const Blog = require('../models/blog');
const router = express.Router();
const { userAuth, verifyAdmin } = require('../middleware/userAuth');
const upload = require('../middleware/upload');
const {
  getAllBlogs,
  getSingleBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  searchBlogs,
  favoriteBlog
} = require('../controller/blogControlller');

router.get('/blogs', getAllBlogs);
router.get('/blogs/search', searchBlogs);        // ✅ Move this BEFORE the dynamic route
router.get('/blogs/:id', getSingleBlog);         // ✅ Dynamic route comes after specific routes

router.post('/blogs/favorite/:id', userAuth, async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    blog.isFavorite = !blog.isFavorite;
    await blog.save();
    res.json({ success: true, message: "Favorite status toggled", blog });
  } catch (err) {
    console.error('Error toggling favorite:', err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Rest of your routes stay the same...
router.post(
  '/blogs',
  userAuth,
  verifyAdmin,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  createBlog
);

router.put(
  '/blogs/:id',
  userAuth,
  verifyAdmin,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
  ]),
  updateBlog
);

router.delete('/blogs/:id', userAuth, verifyAdmin, deleteBlog);

module.exports = router;
