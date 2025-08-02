// In your main server file (app.js or server.js or index.js)
const express = require('express');
const { userAuth } = require('../middleware/userAuth');
const { getUserData, updateUserProfile } = require('../controller/userController');
const { uploadFiles, upload, uploadAvatar } = require('../controller/uploadController');
const User = require('../models/user');

const router = express.Router();

router.get('/data', userAuth, async (req,res)=>{
  try {
    const user = await User.findById(req.user._id).select('-password');
    if(!user) return res.status(404).json({success:false,message:'User not found'});
    res.json({success:true,user});
  } catch(err){
    console.error('GET /user/data error', err);
    res.status(500).json({success:false,message:'Server error'});
  }
});

router.post('/', upload.array('uploaded_Image', 10), uploadFiles);

router.put('/profile', userAuth, uploadAvatar.single('avatar'), updateUserProfile);


router.get('/admin/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/update-profile', userAuth, async (req, res) => {
  try {
    const { name, age, dateOfBirth, phone } = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, age, dateOfBirth, phone },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile',
    });
  }
});

module.exports = router;