const Course = require('../models/course');
const mongoose = require('mongoose');
const path = require('path');




const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';


const formatUrl = (filePath) => {
  if (!filePath) return null;
  if (filePath.startsWith('http')) return filePath;
  return `${BASE_URL.replace(/\/+$/, '')}/${filePath.replace(/^\/+/, '')}`;
};


const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    const processedCourses = courses.map(course => ({
      ...course.toObject(),
      image: formatUrl(course.image),
      video: formatUrl(course.video)
    }));

    res.status(200).json({
      success: true,
      count: processedCourses.length,
      message: 'Courses fetched successfully',
      data: processedCourses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message
    });
  }
};

const getSingleCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const processedCourse = {
      ...course.toObject(),
      image: formatUrl(course.image),
      video: formatUrl(course.video)
    };

    res.status(200).json({
      success: true,
      message: 'Course retrieved successfully',
      data: processedCourse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving course',
      error: error.message
    });
  }
};



const createCourse = async (req, res) => {
  try {
    const { title, description, price, couchName, timing } = req.body;

    if (!title || !description || !price || !couchName || !req.files?.image || !req.files?.video) {
      return res.status(400).json({ success: false, message: 'All fields including image and video are required' });
    }

    const timingData = JSON.parse(timing);

    // Upload image
    const imageUpload = await uploadBufferToCloudinary(req.files.image[0].buffer, 'courses/images', 'image');

    // Upload video
    const videoUpload = await uploadBufferToCloudinary(req.files.video[0].buffer, 'courses/videos', 'video');

    const newCourse = new Course({
      title,
      description,
      price,
      couchName,
      timing: timingData,
      image: imageUpload.secure_url,
      video: videoUpload.secure_url,
      cloudinary_id_image: imageUpload.public_id,
      cloudinary_id_video: videoUpload.public_id
    });

    const savedCourse = await newCourse.save();
    res.status(201).json({ success: true, message: 'Course created', data: savedCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    if (req.files?.image) {
      if (course.cloudinary_id_image) {
        await cloudinary.uploader.destroy(course.cloudinary_id_image, { resource_type: 'image' });
      }
      const img = await uploadBufferToCloudinary(req.files.image[0].buffer, 'courses/images', 'image');
      course.image = img.secure_url;
      course.cloudinary_id_image = img.public_id;
    }

    if (req.files?.video) {
      if (course.cloudinary_id_video) {
        await cloudinary.uploader.destroy(course.cloudinary_id_video, { resource_type: 'video' });
      }
      const vid = await uploadBufferToCloudinary(req.files.video[0].buffer, 'courses/videos', 'video');
      course.video = vid.secure_url;
      course.cloudinary_id_video = vid.public_id;
    }

    Object.keys(req.body).forEach(key => {
      if (key !== 'image' && key !== 'video') course[key] = req.body[key];
    });

    await course.save();
    res.status(200).json({ success: true, message: 'Course updated', data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete course',
      error: error.message
    });
  }
};

const searchCourses = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const courses = await Course.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { couchName: { $regex: query, $options: 'i' } }
      ]
    });

    const processed = courses.map(course => ({
      ...course.toObject(),
      image: formatUrl(course.image),
      video: formatUrl(course.video)
    }));

    res.status(200).json({
      success: true,
      count: processed.length,
      data: processed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to search courses',
      error: error.message
    });
  }
};

module.exports = {
  getAllCourses,
  getSingleCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  searchCourses
};
