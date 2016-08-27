var express = require('express');
var Uuid = require('node-uuid');
var router = express.Router();
var PayPal = require('paypal-rest-sdk');
var Ipn = require('paypal-ipn');
var Fs = require('fs');
var LoginService = require('./../../services/server/LoginService.js');
var PayPalService = require('./../../services/server/PaypalService.js');
var Config = require('./../../config.js');
var paypalConfig = require('./../../config.json');

PayPal.configure(paypalConfig.api);

router.post('/create', function (req, res, next) {

    var loginService = LoginService(req.session);

    if (!loginService.isLoggedIn()) {
        return res.status(403).send();
    }

    PayPalService.getPaypalMethodOption(req.body.paymentMethodOptionId).then(function (paymentMethodOption) {
        var invoiceId = Uuid.v4();
        var payment = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "transactions": [{
                "amount": {
                    "currency": 'USD',
                    "total": paymentMethodOption.Price
                },
                "description": paymentMethodOption.Description,
                "invoice_number": invoiceId
            }]
        };

        payment.redirect_urls = {
            "return_url": Config.paypal.return_url,
            "cancel_url": Config.paypal.return_url
        };

        PayPal.payment.create(payment, {}, function (error, payment) {
            if (error) {
                res.redirect('/donate/error');
                return next(err);
            }

            return PayPalService.addPayment(loginService.getUserId(), payment.id, invoiceId, req.body.paymentMethodOptionId).then(function () {
                var redirectUrl = null;
                for (var i = 0; i < payment.links.length; i++) {
                    var link = payment.links[i];
                    if (link.method === 'REDIRECT') {
                        redirectUrl = link.href;
                    }
                }
                res.redirect(redirectUrl);
            });
        }).catch(next);
    });
});

router.get('/execute', function (req, res, next) {

    var loginService = LoginService(req.session);

    if (!loginService.isLoggedIn()) {
        return res.status(403).send();
    }

    var paymentId = req.query.paymentId;
    var payerId = req.query.PayerID;
    var token = req.query.token;

    var details = {"payer_id": payerId};

    PayPal.payment.execute(paymentId, details, function (error, paypalPayment) {

        LogPayPalDirect(loginService.getUserId(), paymentId, paypalPayment, error);

        if (error) {
            if (error.response.httpStatusCode === 400) {
                res.redirect('/donate/alreadypayed');
            } else {
                res.redirect('/donate/error');
                next(error);
            }
        } else {
            switch (paypalPayment.state) {
                case 'approved':
                case 'created':
                {
                    return PayPalService.completePayment(paymentId, payerId, token).then(function (isSuccess) {
                        if (isSuccess) {
                            return res.redirect('/donate/success');
                        }
                        return res.redirect('/donate/error');
                    }).catch(function (err) {
                        return next(err);
                    });
                }
                case 'pending':
                case 'in_progress':
                {
                    return res.redirect('/donate/pending');
                }
                case 'canceled':
                {
                    return res.redirect('/donate/cancelled');
                }
                default :
                {
                    return res.redirect('/donate/error');
                }
            }
        }
    });
});

router.post('/ipn', function (req, res, next) {
    Ipn.verify(req.body, {'allow_sandbox': false}, function (verifyError, message) {

        LogPayPalIpn(verifyError, message, req.body);

        if (verifyError) {
            return next(verifyError);
        }

        if (req.body.payment_status === 'Completed') {
            PayPalService.completeIpnPayment(req.body.invoice, req.body.payer_id).then(function () {
                res.status(200).send();
            }).catch(next);
        } else {
            res.status(200).send();
        }
    });
});

function LogPayPalIpn(ipnError, ipnMessage, body) {
    var filepath = __dirname + '/../../paypalIPNLog.txt';
    createFileIfNotExists(filepath);
    Fs.appendFileSync(filepath, 'Date: ' + new Date() + '\r\n' + 'Error: ' + ipnError + '\r\n' + 'Message: ' + ipnMessage + '\r\n' + 'Body: ' + JSON.stringify(body) + '\r\n' + '-------' + '\r\n');
}

function LogPayPalDirect(accountId, paymentId, payment, error) {
    var filepath = __dirname + '/../../paypalDirectLog.txt';
    createFileIfNotExists(filepath);
    Fs.appendFileSync(filepath, 'Date: ' + new Date() + '\r\n' + 'Error: ' + error + '\r\n' + 'accountId: ' + accountId + '\r\n' + 'PaymentId: ' + paymentId + '\r\n' + 'Payment: ' + JSON.stringify(payment) + '\r\n' + '-------' + '\r\n');
}

function createFileIfNotExists(filepath) {
    try {
        if (!Fs.statSync(filepath).isFile()) {
            Fs.openSync(filepath, 'w');
        }
    } catch (err) {
        Fs.openSync(filepath, 'w');
    }
}

module.exports = router;