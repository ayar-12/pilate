const express = require('express');
const Blog = require('../models/blog');
const Favorite = require('../models/favorite'); 
const router = express.Router();
const { userAuth, verifyAdmin } = require('../middleware/userAuth');
const upload = require('../middleware/upload');
const {
  getAllBlogs,
  getSingleBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  searchBlogs
} = require('../controller/blogControlller');

// ===== Blog public routes =====
router.get('/blogs', getAllBlogs);
router.get('/blogs/search', searchBlogs); 
router.get('/blogs/:id', getSingleBlog);

// ===== Favorites =====

// Toggle favorite for the logged-in user
router.post('/blogs/favorite/:id', userAuth, async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user._id;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const existing = await Favorite.findOne({ user: userId, blog: blogId });

    if (existing) {
      await existing.deleteOne();
      return res.json({ success: true, favorited: false });
    } else {
      await Favorite.create({ user: userId, blog: blogId });
      return res.json({ success: true, favorited: true });
    }

  } catch (err) {
    console.error('Error toggling favorite:', err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Get all favorites for the logged-in user
router.get('/blogs/favorites', userAuth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate('blog');
    const blogs = favorites.map(f => f.blog).filter(Boolean); // remove nulls if any blog is deleted
    res.json({ success: true, data: blogs, count: blogs.length });
  } catch (err) {
    console.error('Error fetching favorites:', err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// ===== Admin-only blog management =====
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
