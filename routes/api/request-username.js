var express = require('express');
var router = express.Router();
var AccountService = require('./../../services/server/AccountService.js');
var RequestUsernameService = require('./../../services/server/RequestUsernameService.js');
var RecaptchaService = require('./../../services/server/RecaptchaService.js');

router.get('/', function (req, res, next) {
    var STATUS = {
        incorrectEmail: 0,
        invalidCaptcha: 1,
        errorSendingEmail: 2,
        success: 3
    };
    RecaptchaService.validateCaptcha(req.query.captcha).then(function (isSuccess) {
        if (!isSuccess) { return res.send({status: STATUS.invalidCaptcha}); }

        return AccountService.getByEmail(req.query.email).then(function (account) {
            if (!account) { return res.send({status: STATUS.incorrectEmail});}

            return RequestUsernameService.sendRequestUsername(req.query.email).then(function () {
                res.send({status: STATUS.success})
            });
        }).catch(function (err) {
            next(err);
        });
    });
});

module.exports = router;
