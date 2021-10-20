const multer = require('multer');

const { ClientErrors } = require('./error');
const { addImage } = require('../services/upload.service');

function getDestination(req, file, cb) {
  cb(null, '/dev/null');
}

function CloudinaryStorage(opts) {
  this.getDestination = opts.destination || getDestination;
}

CloudinaryStorage.prototype._handleFile = function (req, file, cb) {
  this.getDestination(req, file, (err, path) => {
    if (err) return cb(err);
    const mystream = addImage(path, cb);

    file.stream.pipe(mystream);
  });
};

CloudinaryStorage.prototype._removeFile = function (req, file, cb) {
  delete file.stream;
  cb(null);
};

const imgStorage = new CloudinaryStorage({
  destination: (req, file, cb) => {
    cb(null, 'webinar/banner');
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    const error = new ClientErrors('Image must be PNG or JPG or JPEG type');
    cb(error, false);
  }
};

const upload = multer({
  storage: imgStorage,
  fileFilter,
});

module.exports = upload;
