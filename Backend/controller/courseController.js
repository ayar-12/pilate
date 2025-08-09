const Course = require('../models/course');
const mongoose = require('mongoose');
const path = require('path');

const uploadBufferToCloudinary = require('../utils/cloudinaryUpload');
const { v2: cloudinary } = require('cloudinary');



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
    const { title, description, price, couchName } = req.body;

    // 🔧 Parse timing if it came as a JSON string
    let timingData = req.body.timing;
    if (typeof timingData === 'string') {
      try {
        timingData = JSON.parse(timingData);
      } catch {
        return res.status(400).json({ success: false, message: 'Invalid timing format (must be JSON array)' });
      }
    }
    if (!Array.isArray(timingData) || timingData.length === 0) {
      return res.status(400).json({ success: false, message: 'Timing must be a non-empty array' });
    }

    if (!title || !description || !price || !couchName || !req.files?.image || !req.files?.video) {
      return res.status(400).json({ success: false, message: 'All fields including image and video are required' });
    }

    // Uploads
    const imageUpload = await uploadBufferToCloudinary(req.files.image[0], 'courses/images', 'image');
    const videoUpload = await uploadBufferToCloudinary(req.files.video[0], 'courses/videos', 'video');

    const newCourse = new Course({
      title,
      description,
      price,
      couchName,
      timing: timingData, // ✅ now an array
      image: imageUpload.secure_url,
      video: videoUpload.secure_url,
      cloudinary_id_image: imageUpload.public_id,
      cloudinary_id_video: videoUpload.public_id
    });

    const savedCourse = await newCourse.save();
    return res.status(201).json({ success: true, message: 'Course created', data: savedCourse });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    // 🔧 If timing is present, parse it from JSON string to array
    if (req.body.timing !== undefined) {
      let timingData = req.body.timing;
      if (typeof timingData === 'string') {
        try {
          timingData = JSON.parse(timingData);
        } catch {
          return res.status(400).json({ success: false, message: 'Invalid timing format (must be JSON array)' });
        }
      }
      if (!Array.isArray(timingData)) {
        return res.status(400).json({ success: false, message: 'Timing must be an array' });
      }
      course.timing = timingData; // ✅ set parsed array
    }

    // Uploads (unchanged)
    if (req.files?.image?.[0]) {
      if (course.cloudinary_id_image) {
        await cloudinary.uploader.destroy(course.cloudinary_id_image, { resource_type: 'image' });
      }
      const img = await uploadBufferToCloudinary(req.files.image[0], 'courses/images', 'image');
      course.image = img.secure_url;
      course.cloudinary_id_image = img.public_id;
    }

    if (req.files?.video?.[0]) {
      if (course.cloudinary_id_video) {
        await cloudinary.uploader.destroy(course.cloudinary_id_video, { resource_type: 'video' });
      }
      const vid = await uploadBufferToCloudinary(req.files.video[0], 'courses/videos', 'video');
      course.video = vid.secure_url;
      course.cloudinary_id_video = vid.public_id;
    }

    // Copy the rest of fields except image/video/timing
    Object.keys(req.body).forEach(key => {
      if (['image', 'video', 'timing'].includes(key)) return;
      course[key] = req.body[key];
    });

    await course.save();
    return res.status(200).json({ success: true, message: 'Course updated', data: course });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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
