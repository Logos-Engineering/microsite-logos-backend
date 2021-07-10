const express = require('express');
const router = express.Router();

/* GET api */
router.get('/', function(req, res, next) {
  res.json({
    message: "Hello"
  });
});

module.exports = router;
