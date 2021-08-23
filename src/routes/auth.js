const router = require('express').Router();

const { postAuthController, putAuthController, deleteAuthController } = require('../controllers/auth.controller');

const { postAuthSchema, putAuthSchema, deleteAuthSchema } = require('../middlewares/validator/schema');
const { validator } = require('../middlewares/validator/index');

router.post('/auth', postAuthSchema, validator, postAuthController);
router.put('/auth', putAuthSchema, validator, putAuthController);
router.delete('/auth', deleteAuthSchema, validator, deleteAuthController);

module.exports = router;
