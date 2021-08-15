const { check } = require('express-validator');

const optUrl = {
  protocols: ['http', 'https'],
  require_protocol: true,
  require_host: true,
  require_valid_protocol: true,
};

// skema untuk data link
const linkSchema = [
  check('name').exists({ checkFalsy: true, checkNull: true }).isString()
    .isLength({ min: 2, max: 50 })
    .withMessage('Link name is required and it must be string type which length of string at least 2 characters'),
  check('link').exists({ checkFalsy: true, checkNull: true }).isURL(optUrl)
    .isLength({ min: 2, max: undefined })
    .withMessage('Link is required and it must be URL type which length of string at least 2 characters'),
  check('publish').exists({ checkFalsy: true, checkNull: true }).isBoolean()
    .toBoolean()
    .withMessage('Publish field is required and it must be boolean type'),
  check('category').exists({ checkFalsy: true, checkNull: true }).isString()
    .isLength({ min: 2, max: 100 })
    .withMessage('Link category is required and it must be string type which length of string at least 2 characters'),
  check('titleWebinar').optional({ checkFalsy: true }).isString()
    .isLength({ min: 2, max: 300 })
    .withMessage('Webinar title is required and it must be string type which length of string at least 2 characters'),
  check('summaryWebinar').optional({ checkFalsy: true }).isString()
    .isLength({ min: 5, max: undefined })
    .withMessage('Webinar summary is required and it must be string type which length of string at least 5 characters'),
];

// skema untuk data user
const userSchema = [
  check('username').exists({ checkFalsy: true, checkNull: true }).isString()
    .isLength({ min: 5, max: 20 })
    .withMessage('Username is required and it must be string type which length of string at least 5 characters'),
];

module.exports = { linkSchema, userSchema };
