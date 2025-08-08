
const Home = require('../models/home');
const cloudinary = require('../utils/cloudinary'); 

const uploadToCloudinary = (file, { folder, resource_type }) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type, overwrite: true },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(file.buffer);
  });

exports.getHome = async (req, res) => {
  let home = await Home.findOne();
  if (!home) home = await Home.create({});

  const out = home.toObject();
  // Always return Cloudinary URLs
  out.video = home.cloudinary_video_url || null;
  out.image = home.cloudinary_image_url || null;

  return res.status(200).json({ success: true, data: [out] });
};

exports.updateHome = async (req, res) => {
  let home = (await Home.findOne()) || new Home();

  // text fields
  const fields = ['title','subTitle','description','button1','button2','button3',
                  'hTitle1','hSubTitle1','hTitle2','hSubTitle2','videoDocumantion','videoTitle'];
  fields.forEach(k => { if (req.body[k] !== undefined) home[k] = req.body[k]; });

  // image upload (Cloudinary)
  if (req.files?.image?.[0]) {
    if (home.cloudinary_id_image) {
      await cloudinary.uploader.destroy(home.cloudinary_id_image, { resource_type: 'image' });
    }
    const up = await uploadToCloudinary(req.files.image[0], { folder: 'pilates/home', resource_type: 'image' });
    home.cloudinary_id_image  = up.public_id;
    home.cloudinary_image_url = up.secure_url; // or cloudinary.url(up.public_id, { transformation: [{ fetch_format:'auto', quality:'auto' }] })
  }

  // video upload (Cloudinary)
  if (req.files?.video?.[0]) {
    if (home.cloudinary_id_video) {
      await cloudinary.uploader.destroy(home.cloudinary_id_video, { resource_type: 'video' });
    }
    const up = await uploadToCloudinary(req.files.video[0], { folder: 'pilates/home', resource_type: 'video' });
    home.cloudinary_id_video  = up.public_id;
    // serve a Safari-friendly URL; f_auto will transcode if needed
    home.cloudinary_video_url = cloudinary.url(up.public_id, {
      resource_type: 'video',
      transformation: [{ fetch_format: 'auto', quality: 'auto' }],
      secure: true
    });
  }

  await home.save();

  const out = home.toObject();
  out.video = home.cloudinary_video_url || null;
  out.image = home.cloudinary_image_url || null;

  return res.status(200).json({ success: true, data: [out] });
};

