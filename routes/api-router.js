var express = require('express');

var apiRouter = require('./api/api.js');
var apiLoginRouter = require('./api/login.js');
var apiClanRouter = require('./api/clan.js');
var apiAccountRouter = require('./api/account.js');
var apiRankingRouter = require('./api/ranking.js');
var apiCharacterRouter = require('./api/character.js');
var apiShopRouter = require('./api/shop.js');
var apiDonateRouter = require('./api/donate.js');
var apiRequestUsername = require('./api/request-username.js');
var apiResetPassword = require('./api/reset-password.js');
var apiForum = require('./api/forum.js');

var router = express.Router();

router.use('/api', apiRouter);
router.use('/api/login', apiLoginRouter);
router.use('/api/account', apiAccountRouter);
router.use('/api/clan', apiClanRouter);
router.use('/api/ranking', apiRankingRouter);
router.use('/api/character', apiCharacterRouter);
router.use('/api/shop', apiShopRouter);
router.use('/api/donate', apiDonateRouter);
router.use('/api/request-username', apiRequestUsername);
router.use('/api/reset-password', apiResetPassword);
router.use('/api/forum', apiForum);

module.exports = router;