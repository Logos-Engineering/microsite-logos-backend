const router = require('express').Router();

const { getAllLinksPublic } = require('../controllers/public.controller');
/**
 * Get all links based on publishing column
 * @return array of object
 */
router.get('/', getAllLinksPublic);

module.exports = router;
