var express = require('express');
var router = express.Router();
var MobileLoginService = require('./../../../services/server/MobileLoginService.js');
var AccountService = require('./../../../services/server/AccountService');
var Async = require('async');

router.post('/', function (req, res, next) {
    Async.waterfall([
        function(callback) {
            AccountService.validateCredentials(req.body.username, req.body.password).then(function (isValid) {
                if (!isValid) {
                    return callback(true);
                }
                callback();
            }).catch(callback);
        },
        function(callback){
            AccountService.getAccountByUsername(req.body.username).then(function(account){
                callback(null, account);
            }).catch(callback);
        },
        function (account, callback) {
            MobileLoginService.createLogin(account.AID).then(function(response){
                callback(null, account, response);
            }).catch(callback);
        }
    ], function(err, account, response){

        if(err instanceof Error){
            return next(err);
        }

        if(typeof(err) === "boolean"){
            return res.send({success : false})
        }

        res.status(201).send({success : true, account : account, token : response.token, selector : response.selector})
    });
});

router.get('/', function (req, res, next) {
    MobileLoginService.verifyLogin(req.query.aid, req.query.selector, req.query.token).then(function(isValid){
        res.send({status : isValid});
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;