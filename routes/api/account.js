var express = require('express');
var router = express.Router();
var AccountService = require('./../../services/server/AccountService.js');
var ClanService = require('./../../services/server/ClanService.js');
var LoginService = require('./../../services/server/LoginService.js');

router.get('/:id', function (req, res, next) {
  AccountService.getAccountIdAid(req.params.id)
        .then(function (account) {
            res.send(account);
        }).catch(function (err) {
      next(err);
  });
});

router.get('/search', function (req, res, next) {
    Promise.all([AccountService.searchAll(req.query.page, req.query.limit, req.query.search, AccountService.orderType.ascendingName), AccountService.getAmountAllSearchResults(req.query.search)])
        .then(function (result) {
            res.send({
                amount: result[1],
                accounts: result[0]
            });
        }).catch(function (err) {
        next(err);
    });
});

router.get('/', function (req, res, next) {
    Promise.all([AccountService.getAll(req.query.page, req.query.limit, AccountService.orderType.ascendingName), AccountService.getAmount()])
        .then(function (result) {
            res.send({
                amount: result[1],
                accounts: result[0]
            });
        }).catch(function (err) {
        next(err);
    });
});

router.get('/:id/clans', function (req, res, next) {
    ClanService.getClansFromAccount(req.params.id).then(function (clans) {
        res.send(clans);
    }).catch(function (err) {
        next(err);
    });
});

router.put('/session', function (req, res, next) {
    AccountService.validateLogin(req.body.userName, req.body.password).then(function (type) {
       if(type !== AccountService.loginTypes.success) { return res.send({type : type})}

        return AccountService.getAccountIdByUsername(req.body.userName).then(function (accountId) {
            LoginService(req.session).setLogin(accountId, req.body.userName);
            res.send({type : type});
        });
    }).catch(function (err) {
        next(err);
    });
});

router.put('/:id', function (req, res, next) {
    var accountId = parseInt(req.params.id);

    if (!LoginService(req.session).isLoggedIn() || LoginService(req.session).getUserId() !== accountId) { return res.status(401).send(); }
    
    req.pipe(req.busboy);

    req.busboy.on('field', function (fieldname, val) {
        req.body[fieldname] = val;
    });

   req.busboy.on('finish', function() {
        AccountService.updateAccount(LoginService(req.session).getUsername(), req.body.email, req.body.password).then(function () {
            return res.send();
        }).catch(function (err) {
            next(err);
        });
    });

    req.busboy.on('file', function (fieldname, file, filename) {
        AccountService.updateAvatar(accountId, file, filename).catch(function (err) {
            next(err);
        });
    });
});

module.exports = router;