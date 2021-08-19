const router = require('express').Router();

// controller
const {
  postLinkController, getAllLinksController, putLinkByIdController, deleteLinkByIdController,
} = require('../controllers/links.controller');

const { postUserController, getUsersController } = require('../controllers/users.controller');

// validator
const { linkSchema, userSchema } = require('../middlewares/validator/schema');
const { validator } = require('../middlewares/validator/index');

// /api/dashboard/links
router.post('/links', linkSchema, validator, postLinkController);
router.get('/links', getAllLinksController);
router.put('/links/:id', linkSchema, validator, putLinkByIdController);
router.delete('/links/:id', deleteLinkByIdController);

// /api/dashboard/users
router.post('/users', userSchema, validator, postUserController);
router.get('/users', getUsersController);

module.exports = router;
