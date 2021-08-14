const router = require('express').Router();

const links = require('./links');
const dashboard = require('./dashboard');

router.get('/', (req, res) => {
  res.json({
    message: 'Index api',
  });
});

router.use('/links', links);
router.use('/dashboard', dashboard);

module.exports = router;
