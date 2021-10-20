const { NotFoundError } = require('../middlewares/error');
const { cloudinary } = require('../config/cloudinary.config');

function addImage(path, cb) {
  return cloudinary.uploader.upload_stream(
    {
      folder: path,
    },
    (error, result) => {
      if (result) {
        cb(null, {
          ...result,
        });
      } else {
        cb(error, null);
      }
    },
  );
}

function deleteImage(publicId) {
  const pattern = /webinar.[^.]*/g;
  const id = publicId.match(pattern);
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(id, (err, result) => {
      if (err) reject(new NotFoundError('The data is not found'));
      resolve(result);
    });
  });
}

module.exports = { deleteImage, addImage };
