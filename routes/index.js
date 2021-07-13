const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Index api'
  })
});

module.exports = router;
