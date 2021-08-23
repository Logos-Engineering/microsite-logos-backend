const { check } = require('express-validator');

const optUrl = {
  protocols: ['http', 'https'],
  require_protocol: true,
  require_host: true,
  require_valid_protocol: true,
};

// skema untuk data link
const linkSchema = [
  check('name', 'Link name is required and it must be string type which length of string at least 2 characters')
    .exists({ checkFalsy: true, checkNull: true })
    .bail()
    .isString()
    .bail()
    .isLength({ min: 2, max: 50 }),
  check('link', 'Link is required and it must be URL type which length of string at least 2 characters')
    .exists({ checkFalsy: true, checkNull: true })
    .bail()
    .isURL(optUrl)
    .bail()
    .isLength({ min: 2, max: undefined }),
  check('publish', 'Publish field is required and it must be boolean type')
    .exists({ checkFalsy: false, checkNull: true })
    .bail()
    .isBoolean()
    .bail()
    .toBoolean(),
  check('category', 'Link category is required and it must be string type which length of string at least 2 characters')
    .exists({ checkFalsy: true, checkNull: true })
    .bail()
    .isString()
    .bail()
    .isLength({ min: 2, max: 100 }),
  check('title', 'Webinar title is required and it must be string type which length of string at least 2 characters')
    .optional({ checkFalsy: true })
    .bail()
    .isString()
    .bail()
    .isLength({ min: 2, max: 300 }),
  check('summary', 'Webinar summary is required and it must be string type which length of the string from 5 up to 500 characters')
    .optional({ checkFalsy: true })
    .bail()
    .isString()
    .bail()
    .isLength({ min: 5, max: 500 }),
];

// skema untuk data user
const postUserSchema = [
  check('username', 'Username is required and it must be string type which length of string at least 5 characters')
    .exists({ checkFalsy: true, checkNull: true })
    .bail()
    .isString()
    .bail()
    .isLength({ min: 5, max: 20 }),
  check('password', 'Minimum length of password is 8')
    .isLength({ min: 8 })
    .bail()
    .isString(),
];

const putUserSchema = [
  check('username', 'Username is required and it must be string type which length of string at least 5 characters')
    .exists({ checkFalsy: true, checkNull: true })
    .bail()
    .isString()
    .bail()
    .isLength({ min: 5, max: 20 }),
  check('oldPassword', 'Minimum length of password is 8')
    .isLength({ min: 8 })
    .bail()
    .isString(),
  check('newPassword', 'Minimum length of password is 8')
    .isLength({ min: 8 })
    .bail()
    .isString(),
];

// Skema untuk auth
const postAuthSchema = [
  check('username', 'Username is required and it must be string type which length of string at least 5 characters')
    .exists({ checkFalsy: true, checkNull: true })
    .bail()
    .isString()
    .bail()
    .isLength({ min: 5, max: 20 }),
  check('password', 'Minimum length of password is 8')
    .isLength({ min: 8 })
    .bail()
    .isString(),
];

const putAuthSchema = [
  check('refreshToken', 'Refresh token is required and string type')
    .exists({ checkFalsy: true, checkNull: true })
    .bail()
    .isString(),
];

const deleteAuthSchema = [
  check('refreshToken', 'Refresh token is required and string type')
    .exists({ checkFalsy: true, checkNull: true })
    .bail()
    .isString(),
];

module.exports = {
  linkSchema,
  postUserSchema,
  putUserSchema,
  postAuthSchema,
  putAuthSchema,
  deleteAuthSchema,
};
