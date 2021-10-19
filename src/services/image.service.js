const fs = require('fs').promises;

const { NotFoundError } = require('../middlewares/error');

function deleteImage(path) {
  return fs.unlink(`${process.cwd()}/${path}`)
    .then(() => Promise.resolve(true))
    .catch(() => Promise.reject(new NotFoundError('The data is not found')));
}

module.exports = { deleteImage };
