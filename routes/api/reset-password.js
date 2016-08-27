var express = require('express');
var router = express.Router();
var AccountService = require('./../../services/server/AccountService.js');
var ResetPasswordService = require('./../../services/server/ResetPasswordService.js');
var RecaptchaService = require('./../../services/server/RecaptchaService.js');

router.get('/', function (req, res, next) {
    var STATUS = {
        incorrectEmail: 0,
        invalidCaptcha: 1,
        errorSendingEmail: 2,
        success: 3
    };
    RecaptchaService.validateCaptcha(req.query.captcha).then(function (isSuccess) {
        if (!isSuccess) { return res.send({status: STATUS.invalidCaptcha});}

        return AccountService.getByEmail(req.query.email).then(function (account) {
            if (!account) { return res.send({status: STATUS.incorrectEmail});}

            return ResetPasswordService.sendResetPasswordEmail(req.query.email).then(function () {
                res.send({status: STATUS.success})
            });
        }).catch(function (err) {
            res.status(500).send({status: STATUS.errorSendingEmail});
            next(err);
        });
    });
});

router.put('/', function (req, res, next) {
    var STATUS = {
        incorrectCaptcha: 0,
        noAccountFound: 1,
        isExpired: 2,
        success: 3
    };

    var resetStatus = ResetPasswordService.getAvailableResetStatuses();

    RecaptchaService.validateCaptcha(req.body.captcha).then(function (isValid) {
        if (!isValid) {
            return res.send({status: STATUS.invalidCaptcha});
        }

        return ResetPasswordService.resetPassword(req.body.code, req.body.password).then(function (status) {
            switch (status) {
                case resetStatus.noAccountFound :
                {
                    return res.send({status: STATUS.noAccountFound});
                }
                case resetStatus.isExpired :
                {
                    return res.send({status: STATUS.isExpired});
                }
                default :
                {
                    return res.send({status: STATUS.success});
                }
            }
        }).catch(function (err) {
            next(err);
        });
    });
});

module.exports = router;
