const { validationResult } = require('express-validator');

const { ClientErrors } = require('../error');

function validator(req, res, next) {
  try {
    const errors = validationResult(req);
    // jika terdapat data yang tidak sesuai dengan skema validasi
    if (!errors.isEmpty()) {
      const arr = errors.array().reduce((acc, { param, msg }) => ({ ...acc, [param]: msg }), {});
      const error = new ClientErrors(arr);
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { validator };
