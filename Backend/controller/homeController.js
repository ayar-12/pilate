
const Home = require('../models/home');
const cloudinary = require('../utils/cloudinary'); // controllers/homeController.js


const uploadToCloudinary = (file, opts) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { ...opts, overwrite: true },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(file.buffer);
  });

exports.getHome = async (req, res) => {
  try {
    let home = await Home.findOne();
    if (!home) home = await Home.create({});
    const out = home.toObject();

    // ✅ always return the Cloudinary URLs if present
    out.video = home.cloudinary_video_url || null;
    out.image = home.cloudinary_image_url || null;

    return res.status(200).json({ success: true, data: [out] });
  } catch (err) {
    console.error('getHome error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateHome = async (req, res) => {
  try {
    let home = await Home.findOne();
    if (!home) home = await Home.create({});

    // text fields
    const fields = [
      'title','subTitle','description',
      'button1','button2','button3',
      'hTitle1','hSubTitle1','hTitle2','hSubTitle2',
      'videoDocumantion','videoTitle'
    ];
    fields.forEach(k => {
      if (req.body[k] !== undefined) home[k] = req.body[k];
    });

    // ✅ image -> Cloudinary
    if (req.files?.image?.[0]) {
      if (home.cloudinary_id_image) {
        try { await cloudinary.uploader.destroy(home.cloudinary_id_image, { resource_type: 'image' }); } catch {}
      }
      const up = await uploadToCloudinary(req.files.image[0], { folder: 'pilates/home', resource_type: 'image' });
      home.cloudinary_id_image  = up.public_id;
      home.cloudinary_image_url = up.secure_url; // or build with cloudinary.url(...)
    }

    // ✅ video -> Cloudinary
    if (req.files?.video?.[0]) {
      if (home.cloudinary_id_video) {
        try { await cloudinary.uploader.destroy(home.cloudinary_id_video, { resource_type: 'video' }); } catch {}
      }
      const up = await uploadToCloudinary(req.files.video[0], { folder: 'pilates/home', resource_type: 'video' });
      home.cloudinary_id_video  = up.public_id;
      // f_auto/q_auto so Safari/Chrome both work
      home.cloudinary_video_url = cloudinary.url(up.public_id, {
        resource_type: 'video',
        transformation: [{ fetch_format: 'auto', quality: 'auto' }],
        secure: true
      });
      // optional legacy fallback
      home.videoHome = ''; // stop using local path
    }

    await home.save();

    const out = home.toObject();
    out.video = home.cloudinary_video_url || null;
    out.image = home.cloudinary_image_url || null;

    return res.json({ success: true, data: [out] });
  } catch (err) {
    console.error('updateHome error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

