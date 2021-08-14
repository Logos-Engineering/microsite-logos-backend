const router = require('express').Router();

// controller
const { postLinkController } = require('../controllers/links.controller');
// validator
const { linkSchema } = require('../middlewares/validator/schema');
const { validator } = require('../middlewares/validator/index');

// api/dashboard/links
router.post('/links', linkSchema, validator, postLinkController);

module.exports = router;
