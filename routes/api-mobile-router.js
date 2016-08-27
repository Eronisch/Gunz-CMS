var express = require('express');

var apiMobileSessionRouter = require('./api/mobile/session.js');
var apiMobileAccountRouter = require('./api/mobile/account.js');
var apiMobileGroupRouter = require('./api/mobile/group.js');
var apiMobileContactRouter = require('./api/mobile/contact.js');

var router = express.Router();

router.use('/api/mobile/session', apiMobileSessionRouter);
router.use('/api/mobile/account', apiMobileAccountRouter);
router.use('/api/mobile/group', apiMobileGroupRouter);
router.use('/api/mobile/contact', apiMobileContactRouter);

module.exports = router;