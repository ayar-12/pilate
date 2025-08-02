const User = require("../models/user");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const path = require("path");

// GET user profile data (excluding password)
const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch user", error: process.env.NODE_ENV === 'development' ? error.message : undefined });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.age = req.body.age || user.age;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      
      if (user.cloudinary_id_avatar) {
        await cloudinary.uploader.destroy(user.cloudinary_id_avatar);
      }

user.avatar = uploadResult.secure_url || `uploads/images/${req.file.filename}`;
console.log("Avatar saved as:", user.avatar);

      user.cloudinary_id_avatar = uploadResult.public_id;

      fs.unlinkSync(req.file.path); // cleanup
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};


module.exports = { getUserData, updateUserProfile };
