const mongoose = require('mongoose');
const Blog = require('../models/blog');
const User = require('../models/user');

const uploadBufferToCloudinary = require('../utils/cloudinaryUpload');
const { v2: cloudinary } = require('cloudinary');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const formatUrl = (filePath) => {
  if (!filePath) return null;
  if (filePath.startsWith('http')) return filePath;
  return `${BASE_URL.replace(/\/+$/, '')}/${filePath.replace(/^\/+/, '')}`;
};

// GET /blogs
const getAllBlogs = async (req, res) => {
  try {
    const userId = req.user?._id; 
    const blogs = await Blog.find({});

    let favoriteIds = [];
    if (userId) {
      const user = await User.findById(userId).select('favorites').lean();
      favoriteIds = (user?.favorites || []).map(id => id.toString());
    }

    const processedBlogs = blogs.map(b => ({
      ...b.toObject(),
      image: formatUrl(b.image),
      video: formatUrl(b.video),
      isFavorite: favoriteIds.includes(b._id.toString())
    }));
    return res.status(200).json({
      success: true,
      count: processedBlogs.length,
      message: 'Blogs fetched successfully',
      data: processedBlogs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Something went wrong. Try again.' });
  }
};

// GET /blogs/:id
const getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid blog ID' });
    }
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    const processedBlog = {
      ...blog.toObject(),
      image: formatUrl(blog.image),
      video: formatUrl(blog.video)
    };
    return res.status(200).json({ success: true, message: 'Blog retrieved successfully', data: processedBlog });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Something went wrong. Try again.' });
  }
};

// POST /blogs
const createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description || !req.files?.image?.[0] || !req.files?.video?.[0]) {
      return res.status(400).json({ success: false, message: 'Title, description, image and video are required' });
    }

    // Upload to Cloudinary (multer must be memoryStorage)
    const img = await uploadBufferToCloudinary(req.files.image[0], 'blogs/images', 'image');
    const vid = await uploadBufferToCloudinary(req.files.video[0], 'blogs/videos', 'video');

    const blog = new Blog({
      title,
      description,
      image: img.secure_url,
      video: vid.secure_url,
      cloudinary_id_image: img.public_id,
      cloudinary_id_video: vid.public_id
    });

    const saved = await blog.save();
    return res.status(201).json({ success: true, message: 'Blog created successfully', data: saved });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to create blog' });
  }
};

// PUT /blogs/:id
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid blog ID' });
    }

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    // Replace image if provided
    if (req.files?.image?.[0]) {
      if (blog.cloudinary_id_image) {
        try { await cloudinary.uploader.destroy(blog.cloudinary_id_image, { resource_type: 'image' }); } catch {}
      }
      const img = await uploadBufferToCloudinary(req.files.image[0], 'blogs/images', 'image');
      blog.image = img.secure_url;
      blog.cloudinary_id_image = img.public_id;
    }

    // Replace video if provided
    if (req.files?.video?.[0]) {
      if (blog.cloudinary_id_video) {
        try { await cloudinary.uploader.destroy(blog.cloudinary_id_video, { resource_type: 'video' }); } catch {}
      }
      const vid = await uploadBufferToCloudinary(req.files.video[0], 'blogs/videos', 'video');
      blog.video = vid.secure_url;
      blog.cloudinary_id_video = vid.public_id;
    }

    // Update text fields
    const allowed = ['title', 'description'];
    allowed.forEach(k => { if (req.body[k] !== undefined) blog[k] = req.body[k]; });

    await blog.save();
    return res.status(200).json({ success: true, message: 'Blog updated successfully', data: blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to update blog' });
  }
};

// DELETE /blogs/:id
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid blog ID' });
    }

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    // Clean up Cloudinary
    try {
      if (blog.cloudinary_id_image) await cloudinary.uploader.destroy(blog.cloudinary_id_image, { resource_type: 'image' });
      if (blog.cloudinary_id_video) await cloudinary.uploader.destroy(blog.cloudinary_id_video, { resource_type: 'video' });
    } catch {}

    return res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Something went wrong. Try again.' });
  }
};

// GET /blogs/search
const searchBlogs = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ success: false, message: 'Search query is required' });

    const blogs = await Blog.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });

    const processed = blogs.map(b => ({
      ...b.toObject(),
      image: formatUrl(b.image),
      video: formatUrl(b.video)
    }));

    return res.status(200).json({ success: true, count: processed.length, data: processed });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Something went wrong. Try again.' });
  }
};

// PUT /blogs/:id/favorite  (recommend PUT)
const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user._id;
    const blogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.status(400).json({ success: false, message: 'Invalid blog ID' });
    }

    const blog = await Blog.findById(blogId).select('_id');
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    const user = await User.findById(userId).select('favorites');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const idx = user.favorites.findIndex(bid => bid.toString() === blogId);
    let favorited;
    if (idx === -1) {
      user.favorites.push(blog._id);
      favorited = true;
    } else {
      user.favorites.splice(idx, 1);
      favorited = false;
    }
    await user.save();

    return res.json({ success: true, favorited, favorites: user.favorites });
  } catch (err) {
    console.error('Toggle favorite error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /blogs/favorites
const getMyFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('favorites').lean();
    const ids = user?.favorites || [];
    if (!ids.length) return res.json({ success: true, count: 0, data: [] });

    const blogs = await Blog.find({ _id: { $in: ids } }).lean();

    // keep order (optional)
    const order = new Map(ids.map((id, i) => [id.toString(), i]));
    blogs.sort((a, b) => (order.get(a._id.toString()) ?? 0) - (order.get(b._id.toString()) ?? 0));

    const processed = blogs.map(b => ({
      ...b,
      image: formatUrl(b.image),
      video: formatUrl(b.video),
      isFavorite: true
    }));

    return res.json({ success: true, count: processed.length, data: processed });
  } catch (err) {
    console.error('getMyFavorites error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch favorites' });
  }
};

module.exports = {
  getAllBlogs,
  getSingleBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  searchBlogs,
  toggleFavorite,
  getMyFavorites
};

