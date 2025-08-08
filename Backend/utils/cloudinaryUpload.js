
const { v2: cloudinary } = require('cloudinary');
const streamifier = require('streamifier');

module.exports = function uploadBufferToCloudinary(file, folder, resource_type) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type, overwrite: true },
      (err, result) => err ? reject(err) : resolve(result)
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};
