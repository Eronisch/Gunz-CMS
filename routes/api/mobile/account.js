var express = require('express');
var router = express.Router();
var AccountService = require('./../../../services/server/AccountService');
var async = require('async');


router.get('/', function (req, res, next) {
    Promise.all([AccountService.searchByName(req.query.page, req.query.limit, req.query.search, AccountService.orderType.ascendingName), AccountService.getAmountByNameSearchResults(req.query.search)])
        .then(function (result) {
            res.send({
                amount: result[1],
                accounts: result[0]
            });
        }).catch(function (err) {
        next(err);
    });
});

router.post('/', function (req, res, next) {
    AccountService.create(req.body.username, req.body.password, req.body.email).then(function () {
        res.status(201).send();
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;