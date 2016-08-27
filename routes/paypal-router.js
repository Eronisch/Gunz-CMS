var express = require('express');
var payPalRouter = require('./web/paypal.js');
var router = express.Router();

router.use('/paypal', payPalRouter);

module.exports = router;