const multer = require("multer");
const path = require("path");
const fs = require('fs');
const { v4: uuidv4 } = require("uuid");
const cloudinary = require('cloudinary').v2;
const userModel = require("../models/user");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer disk storage for local save
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder;
    if (["image", "avatar", "uploaded_Image"].includes(file.fieldname)) {
      folder = path.join(__dirname, '..', 'uploads/images');
    } else if (file.fieldname === "video") {
      folder = path.join(__dirname, '..', 'uploads/videos');
    }
    cb(null, folder || path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpg", "image/jpeg", "video/mp4", "application/pdf"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg, .jpeg, .mp4, and .pdf formats allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Avatar-specific uploader
const uploadAvatar = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const folder = path.join(__dirname, '..', 'uploads/images');
      cb(null, folder);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(file.originalname);
      cb(null, `avatar-${uniqueSuffix}${ext}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpg", "image/jpeg"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg, .jpeg formats allowed for avatar!"));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Upload files to Cloudinary after saving locally
const uploadFiles = async (req, res) => {
  try {
    const uploadedFiles = req.files;
    let img, vid, pdf;

    for (const file of uploadedFiles) {
      const ext = path.extname(file.filename).slice(1);
      const filePath = path.resolve(__dirname, "../uploads", file.filename);

      if (["jpg", "jpeg", "png"].includes(ext)) {
        img = await cloudinary.uploader.upload(filePath);
      } else if (ext === "mp4") {
        vid = await cloudinary.uploader.upload(filePath, { resource_type: "video" });
      } else if (ext === "pdf") {
        pdf = await cloudinary.uploader.upload(filePath, { pages: true });
      }
      // Delete local file after upload
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

res.status(201).json({
  success: true,
  data: {
    avatar: img?.secure_url,
    video: vid?.secure_url,
    pdf: pdf?.secure_url,
  }
});


    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

module.exports = {
  upload,
  uploadAvatar,
  uploadFiles
};
