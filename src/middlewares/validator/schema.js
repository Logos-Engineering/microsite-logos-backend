const { check } = require('express-validator');

const optUrl = {
  protocols: ['http','https'],
  require_protocol: true,
  require_host: true,
  require_valid_protocol: true
}

// skema untuk data link
const linkSchema = [
  check('name').exists({ checkFalsy: true, checkNull: true }).isString().withMessage('The link name is required and it must be string type'),
  check('link').exists({ checkFalsy: true, checkNull: true }).isURL(optUrl).withMessage('The link is required and it must be URL type'),
  check('publish').exists({ checkFalsy: true, checkNull: true }).isBoolean().toBoolean().withMessage('Publish field is required and it must be boolean type'),
  check('category').exists({ checkFalsy: true, checkNull: true }).isString().withMessage('The link category is required and it must be string type'),
  check('titleWebinar').optional({ checkFalsy: true }).isString().withMessage('The webinar title is required and it must be string type'),
  check('summaryWebinar').optional({ checkFalsy: true }).isString().withMessage('The webinar summary is required and it must be string type'),
];

// skema untuk data user
const userSchema = [
  check('username').exists({ checkFalsy: true, checkNull: true }).isString().withMessage('Username is required and it must be string type'),
];

module.exports = { linkSchema, userSchema };
