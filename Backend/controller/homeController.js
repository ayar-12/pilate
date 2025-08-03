// controllers/homeController.js
const Home    = require('../models/home');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

exports.getHome = async (req, res) => {
  let home = await Home.findOne();
  if (!home) home = await Home.create({ videoHome: '1752454349113-video.mp4' });

  const out = home.toObject();
  out.video = home.videoHome
    ? `${BASE_URL}/uploads/videos/${home.videoHome}`
    : null;
  out.image = home.image
    ? `${BASE_URL}/uploads/images/${home.image}`
    : null;

  return res.status(200).json({ success: true, data: [out] });
};

exports.updateHome = async (req, res) => {
  let home = (await Home.findOne()) || new Home();
  Object.assign(home, req.body);

  if (req.files.video?.[0]) home.videoHome = req.files.video[0].filename;
  if (req.files.image?.[0]) home.image     = req.files.image[0].filename;

  await home.save();

  const out = home.toObject();
  out.video = home.videoHome ? `/uploads/videos/${home.videoHome}` : null;
  out.image = home.image
    ? `${BASE_URL}/uploads/images/${home.image}`
    : null;

  return res.status(200).json({ success: true, data: [out] });
};
