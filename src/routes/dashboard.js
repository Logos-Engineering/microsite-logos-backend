const router = require('express').Router();

// controller
const { postLinkController, getAllLinksController, putLinkByIdController } = require('../controllers/links.controller');
// validator
const { linkSchema } = require('../middlewares/validator/schema');
const { validator } = require('../middlewares/validator/index');

// api/dashboard/links
router.post('/links', linkSchema, validator, postLinkController);
router.get('/links', getAllLinksController);
router.put('/links/:id', linkSchema, validator, putLinkByIdController);

module.exports = router;
