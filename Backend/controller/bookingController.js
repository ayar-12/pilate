const bookingModel = require('../models/booking');
const courseModel = require('../models/course');
const path = require('path');
const nodemailer = require('nodemailer');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASS
  }
});


const newBooking = async (req, res) => {
  const {
    courseId,
    userName,
    userEmail,
    userPhone,
    time,
    courseName,
    coursePrice,
    courseDetails
  } = req.body;

  try {
    if (!courseId || !userName || !userEmail || !userPhone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: courseId, userName, userEmail, userPhone'
      });
    }

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const existingBooking = await bookingModel.findOne({
      courseId,
      userEmail
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'You have already booked this course'
      });
    }

    const newBooking = new bookingModel({
      courseId,
      userName,
      userEmail,
      userPhone,
      selectedTime: time || 'TBA',
      courseName: courseName || course.title,
      coursePrice: coursePrice || course.price || 0,
      bookingDate: new Date(),
      status: 'confirmed',
      courseDetails: {
        title: courseDetails?.title || course.title,
        instructor: courseDetails?.instructor || course.instructor,
        duration: courseDetails?.duration || course.duration,
        description: courseDetails?.description || course.description
      }
    });

    await newBooking.save();
    
    // Define email template
    const htmlTemplate = ({ greeting, recipient, bookingTitle, isAdmin }) => `
      <div style="font-family:Arial,sans-serif; padding:20px; color:#333; background:#f9f9f9;">
        <h2 style="color:${isAdmin ? '#2196F3' : '#4CAF50'};">${greeting}</h2>
        <p>Hello <strong>${recipient}</strong>,</p>
        <p>${bookingTitle}</p>
        <hr style="margin:20px 0;">
        <table style="width:100%; border-collapse:collapse;">
          <tr><td><strong>Course:</strong></td><td>${courseName || course.title}</td></tr>
          <tr><td><strong>Time:</strong></td><td>${time || 'TBA'}</td></tr>
          <tr><td><strong>Instructor:</strong></td><td>${courseDetails?.instructor || course.instructor || 'N/A'}</td></tr>
          <tr><td><strong>Duration:</strong></td><td>${courseDetails?.duration || course.duration || 'N/A'}</td></tr>
          <tr><td><strong>Price:</strong></td><td>${coursePrice || course.price || 0} OMR</td></tr>
        </table>
        ${isAdmin ? `<h4 style="margin-top:30px;">User Info:</h4>
          <ul>
            <li><strong>Name:</strong> ${userName}</li>
            <li><strong>Email:</strong> ${userEmail}</li>
            <li><strong>Phone:</strong> ${userPhone}</li>
          </ul>` : ''}
        <p style="margin-top:30px;">Coach App System</p>
      </div>
    `;

    // Send email to user
    await transporter.sendMail({
      from: `"Coach App" <${process.env.SENDER_EMAIL}>`,
      to: userEmail,
      subject: '✅ Your Booking Confirmation',
      html: htmlTemplate({
        greeting: 'Booking Confirmed',
        recipient: userName,
        bookingTitle: `You've successfully booked <strong>${courseName || course.title}</strong>.`,
        isAdmin: false
      })
    });

    await transporter.sendMail({
      from: `"Coach App" <${process.env.SENDER_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `📥 New Booking: ${courseName || course.title}`,
      html: htmlTemplate({
        greeting: 'New Booking Notification',
        recipient: 'Admin',
        bookingTitle: `<strong>${userName}</strong> booked <strong>${courseName || course.title}</strong>.`,
        isAdmin: true
      })
    });

    res.status(201).json({
      success: true,
      message: `Booking successful for ${courseName || course.title}!`,
      data: {
        bookingId: newBooking._id,
        courseTitle: courseName || course.title,
        selectedTime: time,
        bookingDate: newBooking.bookingDate
      }
    });

  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({
      success: false,
      message: 'Booking failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

const userBooking = async (req, res) => {
  try {
    const bookings = await bookingModel
      .find({ userEmail: req.user.email })
      .populate('courseId')
      .sort({ bookingDate: -1 });

    const formattedBookings = bookings.map(booking => ({
      _id: booking._id,
      courseName: booking.courseName,
      selectedTime: booking.selectedTime,
      bookingDate: booking.bookingDate,
      status: booking.status,
      coursePrice: booking.coursePrice,
      courseDetails: booking.courseDetails,
      course: booking.courseId
    }));

    res.status(200).json({
      success: true,
      data: formattedBookings,
      count: formattedBookings.length
    });
  } catch (err) {
    console.error('Fetch user bookings error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: err.message
    });
  }
};


const bookinSesstion = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const allBookings = await bookingModel
      .find()
      .populate('courseId')
      .sort({ bookingDate: -1 })
      .skip(skip)
      .limit(limit);

    const totalBookings = await bookingModel.countDocuments();

    const formattedBookings = allBookings.map(booking => ({
      _id: booking._id,
      userName: booking.userName,
      userEmail: booking.userEmail,
      userPhone: booking.userPhone,
      courseName: booking.courseName,
      selectedTime: booking.selectedTime,
      bookingDate: booking.bookingDate,
      status: booking.status,
      coursePrice: booking.coursePrice,
      course: booking.courseId
    }));

    res.status(200).json({ 
      success: true, 
      data: formattedBookings,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalBookings / limit),
        totalBookings,
        hasNext: page < Math.ceil(totalBookings / limit),
        hasPrev: page > 1
      }
    });
  } catch (err) {
    console.error('Fetch all bookings error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching sessions', 
      error: err.message 
    });
  }
};

const updateUser = async (req, res) => {
  const { bookingId, ...updateData } = req.body;
  
  try {
    if (!bookingId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Booking ID is required' 
      });
    }

    const allowedUpdates = ['userName', 'userPhone', 'selectedTime', 'status'];
    const filteredUpdateData = {};
    
    Object.keys(updateData).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdateData[key] = updateData[key];
      }
    });

    const updated = await bookingModel.findByIdAndUpdate(
      bookingId, 
      { ...filteredUpdateData, updatedAt: new Date() }, 
      { new: true, runValidators: true }
    ).populate('courseId');

    if (!updated) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Booking updated successfully',
      data: updated
    });
  } catch (err) {
    console.error('Update booking error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update booking', 
      error: err.message 
    });
  }
};

const getCourseById = async (req, res) => {
  try {
    console.log('\n=== DEBUG: getCourseById ===');
    console.log('Course ID:', req.params.id);

    const course = await courseModel.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }

    console.log('Raw course data:', {
      id: course._id,
      title: course.title,
      image: course.image,
      video: course.video
    });

    
    const processedCourse = {
      ...course.toObject(),
      image: course.image?.startsWith('http')
        ? course.image
        : `${BASE_URL.replace(/\/+$/, '')}/${course.image.replace(/^\/+/, '')}`,
      video: course.video?.startsWith('http')
        ? course.video
        : course.video
          ? `${BASE_URL.replace(/\/+$/, '')}/${course.video.replace(/^\/+/, '')}`
          : null
    };

    console.log('Processed course data:', {
      id: processedCourse._id,
      title: processedCourse.title,
      image: processedCourse.image,
      video: processedCourse.video
    });

    res.status(200).json({ 
      success: true, 
      data: processedCourse 
    });
  } catch (err) {
    console.error('Get course error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get course', 
      error: err.message 
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await bookingModel.findByIdAndUpdate(
      req.params.bookingId,
      { status: 'cancelled', updatedAt: new Date() },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (err) {
    console.error('Cancel booking error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to cancel booking', 
      error: err.message 
    });
  }
};

const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await bookingModel.countDocuments();
    const confirmedBookings = await bookingModel.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await bookingModel.countDocuments({ status: 'cancelled' });
    const totalRevenue = await bookingModel.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$coursePrice' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (err) {
    console.error('Get booking stats error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get booking stats', 
      error: err.message 
    });
  }
};



const getDailyBookingStats = async (req, res) => {
  try {
    const bookings = await bookingModel.find({}, {
      userName: 1,
      userPhone: 1,
      userEmail: 1,
      bookingDate: 1,
      selectedTime: 1,
      courseName: 1,
    }).sort({ bookingDate: -1 });

    const grouped = {};

    bookings.forEach(b => {
      const date = new Date(b.bookingDate).toISOString().split('T')[0]; // format YYYY-MM-DD
      if (!grouped[date]) grouped[date] = [];

      grouped[date].push({
        name: b.userName,
        phone: b.userPhone,
        email: b.userEmail,
        time: b.selectedTime,
        className: b.courseName,
      });
    });

    const result = Object.entries(grouped).map(([date, details]) => ({
      date,
      details
    }));

    res.json({ success: true, data: result });

  } catch (err) {
    console.error('getDailyBookingStats error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};



module.exports = {
  newBooking,
  userBooking,
  bookinSesstion,
  updateUser,
  getCourseById,
  cancelBooking,
  getBookingStats,
    getDailyBookingStats
};