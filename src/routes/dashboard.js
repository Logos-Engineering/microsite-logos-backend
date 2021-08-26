const router = require('express').Router();

// controller
const {
  postLinkController, getAllLinksController, putLinkByIdController, deleteLinkByIdController,
} = require('../controllers/links.controller');

const {
  postUserController, putUserByIdController, getUsersController, deleteUserByIdController,
} = require('../controllers/users.controller');

// validator
const { linkSchema, postUserSchema, putUserSchema } = require('../middlewares/validator/schema');
const { validator } = require('../middlewares/validator/index');

// authorization
const authorizationUser = require('../middlewares/authorization');

// /api/dashboard/links
router.post('/links', linkSchema, validator, postLinkController);
router.get('/links', getAllLinksController);
router.put('/links/:id', linkSchema, validator, putLinkByIdController);
router.delete('/links/:id', deleteLinkByIdController);

// hanya superadmin
// /api/dashboard/users
router.post('/users', authorizationUser, postUserSchema, validator, postUserController);
router.put('/users/:id', authorizationUser, putUserSchema, validator, putUserByIdController);
router.get('/users', authorizationUser, getUsersController);
router.delete('/users/:id', authorizationUser, deleteUserByIdController);

module.exports = router;
