const mongoose = require('mongoose');
const Blog = require('../models/blog');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const formatUrl = (filePath) => {
  if (!filePath) return null;
  if (filePath.startsWith('http')) return filePath;
  return `${BASE_URL.replace(/\/+$/, '')}/${filePath.replace(/^\/+/, '')}`;
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({});
    const processedBlogs = blogs.map(blog => ({
      ...blog.toObject(),
      image: formatUrl(blog.image),
      video: formatUrl(blog.video)
    }));

    res.status(200).json({
      success: true,
      count: processedBlogs.length,
      message: 'Blogs fetched successfully',
      data: processedBlogs
    });
  } catch (error) {
    return res.json({ success: false, message: 'Something went wrong. Try again.' });
  }
};

const getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID'
      });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const processedBlog = {
      ...blog.toObject(),
      image: formatUrl(blog.image),
      video: formatUrl(blog.video)
    };

    res.status(200).json({
      success: true,
      message: 'Blog retrieved successfully',
      data: processedBlog
    });
  } catch (error) {
    return res.json({ success: false, message: 'Something went wrong. Try again.' });
  }
};

const createBlog = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description || !req.files || !req.files.image || !req.files.video) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, image and video are required'
      });
    }

    const newBlog = new Blog({
      title,
      description,
      image: `uploads/images/${req.files.image[0].filename}`,
      video: `uploads/videos/${req.files.video[0].filename}`,
    });

    const savedBlog = await newBlog.save();
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: savedBlog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create blog',
      error: error.message
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID'
      });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const updateData = { ...req.body };

    if (req.files && req.files.image) {
      updateData.image = `uploads/images/${req.files.image[0].filename}`;
    }
    if (req.files && req.files.video) {
      updateData.video = `uploads/videos/${req.files.video[0].filename}`;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, { $set: updateData }, { new: true });

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: updatedBlog
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update blog',
      error: error.message
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID'
      });
    }

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    return res.json({ success: false, message: 'Something went wrong. Try again.' });
  }
};

const searchBlogs = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const blogs = await Blog.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });

    const processedBlogs = blogs.map(blog => ({
      ...blog.toObject(),
      image: formatUrl(blog.image),
      video: formatUrl(blog.video)
    }));

    res.status(200).json({
      success: true,
      count: processedBlogs.length,
      data: processedBlogs
    });
  } catch (error) {
    return res.json({ success: false, message: 'Something went wrong. Try again.' });
  }
};

const favoriteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    blog.isFavorite = !blog.isFavorite;
    await blog.save();

    res.status(200).json({
      success: true,
      message: `Blog ${blog.isFavorite ? 'added to' : 'removed from'} favorites`,
      data: blog
    });
  } catch (err) {
    return res.json({ success: false, message: 'Something went wrong. Try again.' });
  }
};

module.exports = {
  getAllBlogs,
  getSingleBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  searchBlogs,
  favoriteBlog
};
