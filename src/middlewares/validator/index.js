const { validationResult } = require('express-validator');
const fs = require('fs');

const { ClientErrors } = require('../error');

function validator(req, res, next) {
  try {
    const errors = validationResult(req);
    // jika terdapat data yang tidak sesuai dengan skema validasi
    if (!errors.isEmpty()) {
      // jika user mengunggah gambar
      if (req.file) {
        // hapus gambar tersebut
        fs.unlink(`${process.cwd()}/${req.file.path}`, (err) => {
          if (err) {
            throw new Error('Internal server error');
          }
        });
      }

      const arr = errors.array().map((obj) => obj.msg);
      const error = new ClientErrors(arr);
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { validator };
