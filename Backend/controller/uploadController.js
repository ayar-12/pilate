const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const cloudinary = require("../utils/cloudinary");
const fs = require('fs');
const userModel = require("../models/user");


const createUploadDirs = () => {
  const dirs = ['uploads/images', 'uploads/videos'];
  dirs.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
};

createUploadDirs();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const field = file.fieldname;
    let folder = null;

    if (["image", "avatar", "uploaded_Image"].includes(field)) {
      folder = path.join(__dirname, '..', 'uploads/images');
    } else if (field === "video") {
      folder = path.join(__dirname, '..', 'uploads/videos');
    }

    if (!folder) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Unexpected field name:", field);
      }
      return cb(new Error(`Unexpected field: ${field}`));
    }

    cb(null, folder);
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
    if (process.env.NODE_ENV === 'development') {
      console.log("File type not allowed:", file.mimetype);
    }
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

const uploadFiles = async (req, res) => {
  try {
    const uploadedFiles = req.files;
    let img, vid, pdff;

    for (const file of uploadedFiles) {
      const ext = path.extname(file.filename).slice(1);
      const filePath = path.resolve(__dirname, "../uploads", file.filename);

      if (["jpg", "jpeg", "png"].includes(ext)) {
        img = await cloudinary.uploader.upload(filePath);
      } else if (ext === "mp4") {
        vid = await cloudinary.uploader.upload(filePath, { resource_type: "video" });
      } else if (ext === "pdf") {
        pdff = await cloudinary.uploader.upload(filePath, { pages: true });
      }

      // Optionally remove the local file after upload
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const user = new userModel({
      name: req.body.name,
      avatar: img?.secure_url,
      video: vid?.secure_url,
      pdf: pdff?.secure_url,
      cloudinary_id_img: img?.public_id,
      cloudinary_id_vid: vid?.public_id,
      cloudinary_id_pdf: pdff?.public_id,
    });

    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Upload error:", err);
    }

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
