var express = require('express');
var router = express.Router();
var PaySafeCardService = require('./../../services/server/PaySafeCardService.js');
var PayPalService = require('./../../services/server/PaypalService.js');
var LoginService = require('./../../services/server/LoginService.js');

router.get('/currentmonth', function (req, res, next) {
    PayPalService.getCurrentDonationThisMonth().then(function (amount) {
        res.send({
            amount : amount
        });
    }).catch(function (err) {
        next(err);
    });
});

router.post('/paysafecard', function (req, res, next) {
    var loginService = LoginService(req.session);

    if(!loginService.isLoggedIn()) {return res.send(401);}

    PaySafeCardService.addPurchase(loginService.getUserId(), req.body.code, req.body.paymentOptionId).then(function () {
        res.status(201).send();
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;