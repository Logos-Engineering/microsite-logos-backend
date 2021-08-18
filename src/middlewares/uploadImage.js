const multer = require('multer');

const imgStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date(Date.now()).toISOString()}-${file.originalname.toLowerCase()}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    const error = new Error('Image must be PNG or JPG or JPEG type');
    error.statusCode = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage: imgStorage,
  fileFilter,
}).single('image');

module.exports = upload;
