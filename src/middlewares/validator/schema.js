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
    .isLength({ min: 2, max: 50 })
    .bail(),
  check('link', 'Link is required and it must be URL type which length of string at least 2 characters')
    .exists({ checkFalsy: true, checkNull: true })
    .bail()
    .isURL(optUrl)
    .bail()
    .isLength({ min: 2, max: undefined })
    .bail(),
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
    .isLength({ min: 2, max: 100 })
    .bail(),
  check('titleWebinar', 'Webinar title is required and it must be string type which length of string at least 2 characters')
    .optional({ checkFalsy: true })
    .bail()
    .isString()
    .bail()
    .isLength({ min: 2, max: 300 })
    .bail(),
  check('summaryWebinar', 'Webinar summary is required and it must be string type which length of string at least 5 characters')
    .optional({ checkFalsy: true })
    .bail()
    .isString()
    .bail()
    .isLength({ min: 5, max: undefined })
    .bail(),
];

// skema untuk data user
const userSchema = [
  check('username', 'Username is required and it must be string type which length of string at least 5 characters')
    .exists({ checkFalsy: true, checkNull: true })
    .bail()
    .isString()
    .bail()
    .isLength({ min: 5, max: 20 })
    .bail(),
];

module.exports = { linkSchema, userSchema };
