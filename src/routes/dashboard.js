const router = require('express').Router();

// controller
const { postLinkController, getAllLinksController } = require('../controllers/links.controller');
// validator
const { linkSchema } = require('../middlewares/validator/schema');
const { validator } = require('../middlewares/validator/index');

// api/dashboard/links
router.post('/links', linkSchema, validator, postLinkController);
router.get('/links', getAllLinksController);

module.exports = router;
