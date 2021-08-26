const router = require('express').Router();

const links = require('./links');
const dashboard = require('./dashboard');
const auth = require('./auth');
const { verifyAccToken } = require('../middlewares/verifyToken');

router.get('/', (req, res) => {
  res.json({
    message: 'Index api',
  });
});

router.use('/links', links);
router.use(auth);
router.use('/dashboard', verifyAccToken, dashboard);

module.exports = router;
