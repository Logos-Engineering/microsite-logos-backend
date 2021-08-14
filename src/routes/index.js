const router = require('express').Router();
const links = require('./links');

router.get('/', (req, res) => {
  res.json({
    message: 'Index api',
  });
});

router.use('/links', links);

module.exports = router;
