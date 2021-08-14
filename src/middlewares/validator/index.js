const { validationResult } = require('express-validator');

const { ClientErrors } = require('../error');

function validator(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const arr = errors.array().map((obj) => obj.msg);
      const error = new ClientErrors(arr);
      throw error;
    }

    next();
  } catch (error) {
    return next(error);
  }
}

module.exports = { validator };
