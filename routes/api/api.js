var express = require('express');
var router = express.Router();
var AccountService = require('./../../services/server/AccountService.js');
var RecaptchaService = require('./../../services/server/RecaptchaService.js');
var ServerStatusService = require('./../../services/server/ServerStatusService.js');
var ItemRotationService = require('./../../services/server/ItemRotationService.js');
var LoginService = require('./../../services/server/LoginService.js');

router.get('/isUsernameUnique', function (req, res, next) {
    var username = req.query.username;

    AccountService.isNameUnique(username).then(function (isUnique) {
        res.send({
            status: isUnique
        });
    }).catch(function (err) {
        next(err);
    });
});

router.get('/isEmailUnique', function (req, res, next) {
    var loginService = LoginService(req.session);

    var email = req.query.email;

    if (!loginService.isLoggedIn()) {
        return AccountService.isEmailUnique(email).then(function (isUnique) {
            return res.send({
                status: isUnique
            }).catch(function (err) {
                next(err);
            });
        });
    }

    AccountService.getAccountByUsername(loginService.getUsername()).then(function (account) {
        if (account.Email === req.query.email) {
            return res.send({status: true});
        }

        AccountService.isEmailUnique(email).then(function (isUnique) {
            return res.send({
                status: isUnique
            });
        }).catch(function (err) {
            next(err);
        });
    });
});

router.post('/addAccount', function (req, res, next) {
    var loginService = LoginService(req.session);

    RecaptchaService.validateCaptcha(req.body.captcha).then(function (isSuccess) {
        if (!isSuccess) { return res.send({isCaptchaValid: false});}

        return AccountService.create(req.body.userName, req.body.password, req.body.email)
    }).then(function (accountId) {
        loginService.setLogin(accountId, req.body.userName);
        return accountId;
    }).then(function (accountId) {
        return ItemRotationService.sendRotationItemsToAccount(accountId);
    }).then(function () {
        res.status(201).send({isCaptchaValid: true});
    }).catch(function (err) {
       next(err);
    });
});

router.get('/getAccount', function (req, res, next) {
    var loginService = LoginService(req.session);

    if (!loginService.isLoggedIn()) { return res.send(); }

    AccountService.getAccountByUsername(loginService.getUsername()).then(function (account) {
        return res.send(account);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/isLoggedIn', function (req, res) {
    res.send({isLoggedIn: LoginService(req.session).isLoggedIn()});
});

router.get('/getLoggedInUsername', function (req, res) {
    var loginService = LoginService(req.session);

    if (loginService.isLoggedIn()) {
        return res.send({
            userName: loginService.getUsername()
        });
    }

    return res.send();
});

router.get('/getServerStatus', function (req, res, next) {
    ServerStatusService.getStatus().then(function (serverStatus) {
        res.send(serverStatus);
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;