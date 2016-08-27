var express = require('express');
var router = express.Router();
var ShopService = require('./../../../services/server/ShopService.js');
var AccountService = require('./../../../services/server/AccountService.js');
var LoginService = require('./../../../services/server/LoginService.js');
var async = require('async');

router.post('/', function (req, res, next) {

    var STATUS = {
        invalidRank: 0,
        invalidUser : 1
    };

    async.waterfall([
        function (callback) {
            AccountService.isGmOrAdmin(LoginService(req.session).getUserId()).then(function (isGmOrAdmin) {
                if(isGmOrAdmin){
                    return callback();
                }
                callback(true, STATUS.invalidRank);
            }).catch(callback);
        },
        function (callback) {
            AccountService.getAccountByUsername(req.body.username).then(function (account) {
                if(account){
                    return callback(null, account.dataValues.AID);
                }
                callback(true, STATUS.invalidUser);
            }).catch(callback);
        },
        function (aid, callback) {
            ShopService.addAccountItem(aid, req.body.itemId, req.body.quantity, req.body.days).then(function () {
                callback();
            }).catch(callback);
        }
    ], function (err, status) {
        if(err instanceof Error){ return next(err);}
        if(err == null && status == null) { return res.status(201).send({isSuccess : true});}
        if(status === STATUS.invalidUser) { return res.status(200).send({isSuccess : false});}

        return res.status(403).send();
    });
});

module.exports = router;
