const express = require('express');
const router = express.Router();

/* GET embed */
router.post('/', async (req, res, next) => {
  res.render('embed', req.body);
});

module.exports = router;
