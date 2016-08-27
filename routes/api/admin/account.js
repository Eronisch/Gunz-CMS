var express = require('express');
var router = express.Router();
var AccountService = require('./../../../services/server/AccountService.js');
var LoginService = require('./../../../services/server/LoginService.js');

router.get('/', function (req, res, next) {
    Promise.all([AccountService.getAdminAll(req.query.page, req.query.limit, AccountService.orderType.descendingId), AccountService.getAmount()])
        .then(function (result) {
            res.send({
                amount: result[1],
                accounts: result[0]
            });
        }).catch(function (err) {
        next(err);
    });
});

router.get('/search', function (req, res, next) {
    console.log('search');
    Promise.all([AccountService.adminSearchAll(req.query.page, req.query.limit, req.query.search, AccountService.orderType.descendingId), AccountService.getAmountSearchAll(req.query.search)]).then(function (result) {
        res.send({
            amount: result[1],
            accounts: result[0]
        });
    }).catch(function (err) {
        next(err);
    });
});

router.put('/:userId/cash', function (req, res, next) {
    AccountService.getAccountIdByUsername(req.params.userId).then(function (accountId) {
        if (!accountId) { return res.send({isSuccess: false});}

        return AccountService.depositDonationCoins(accountId, req.body.cash).then(function () {
            res.send({isSuccess: true});
        });
    }).catch(function (err) {
        next(err);
    });
});

router.put('/:userId/ban', function (req, res, next) {
    AccountService.banUser(req.params.userId, req.body.date).then(function (isSuccess) {
        res.send({isSuccess: isSuccess})
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;
