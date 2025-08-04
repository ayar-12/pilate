const Course = require('../models/course');
const mongoose = require('mongoose');
const path = require('path');


BASE_URL= https:https://pilate-1.onrender.com

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
      return res.status(400).json({
        success: false,
        message: 'All fields including image and video are required'
      });
    }

    if (isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({ success: false, message: 'Invalid price' });
    }

    let timingData;
    try {
      timingData = JSON.parse(timing);
      if (!Array.isArray(timingData) || timingData.length === 0) {
        throw new Error();
      }
    } catch {
      return res.status(400).json({
        success: false,
        message: 'Invalid timing format. Expected JSON array of objects'
      });
    }

    const newCourse = new Course({
      title,
      description,
      price,
      couchName,
      timing: timingData,
      image: req.files.image[0].path,
      video: req.files.video[0].path
    });

    const savedCourse = await newCourse.save();

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: savedCourse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create course',
      error: error.message
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid course ID' });
    }

    if (req.body.price && (isNaN(Number(req.body.price)) || Number(req.body.price) < 0)) {
      return res.status(400).json({ success: false, message: 'Invalid price' });
    }

    if (req.body.timing) {
      try {
        const timingData = JSON.parse(req.body.timing);
        if (!Array.isArray(timingData)) {
          throw new Error();
        }
        updateData.timing = timingData;
      } catch {
        return res.status(400).json({
          success: false,
          message: 'Invalid timing format. Expected JSON array of objects'
        });
      }
    }

if (req.files?.image) {
  updateData.image = req.files.image[0].path;
} else {
  const existing = await Course.findById(id);
  if (existing) updateData.image = existing.image;
}

if (req.files?.video) {
  updateData.video = req.files.video[0].path;
} else {
  const existing = await Course.findById(id);
  if (existing) updateData.video = existing.video;
}


    const updatedCourse = await Course.findByIdAndUpdate(id, { $set: updateData }, {
      new: true,
      runValidators: true
    });

    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update course',
      error: error.message
    });
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
