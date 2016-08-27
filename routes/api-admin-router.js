var express = require('express');

var apiAdminCharacterRouter = require('./api/admin/character.js');
var apiAdminAccountRouter = require('./api/admin/account.js');
var apiAdminPaySafeCardRouter = require('./api/admin/paysafecard.js');
var apiAdminItemOfTheDayRouter = require('./api/admin/itemOfTheDay.js');
var apiAdminItemRouter = require('./api/admin/item.js');
var apiAdminClanRouter = require('./api/admin/clan.js');
var apiAdminShopRouter = require('./api/admin/shop.js');
var apiAdminPaypalRouter = require('./api/admin/paypal.js');
var apiAdminRotationRouter = require('./api/admin/rotation.js');

var AccountService = require('./../services/server/AccountService.js');
var LoginService = require('./../services/server/LoginService.js');

var router = express.Router();

router.use('/api/admin', authorizeAdminApi);
router.use('/api/admin/character/', apiAdminCharacterRouter);
router.use('/api/admin/account/', apiAdminAccountRouter);
router.use('/api/admin/paysafecard/', apiAdminPaySafeCardRouter);
router.use('/api/admin/item/', apiAdminItemRouter);
router.use('/api/admin/clan', apiAdminClanRouter);
router.use('/api/admin/paypal', apiAdminPaypalRouter);
router.use('/api/admin/itemOfTheDay', apiAdminItemOfTheDayRouter);
router.use('/api/admin/shop', apiAdminShopRouter);
router.use('/api/admin/rotation', apiAdminRotationRouter);

function authorizeAdminApi(req, res, next) {
    AccountService.isStaff(LoginService(req.session).getUserId()).then(function (isStaff) {
        if (isStaff) {
            return next();
        }
        return res.status(403).send();
    });
}

module.exports = router;