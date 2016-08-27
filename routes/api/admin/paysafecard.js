var express = require('express');
var router = express.Router();
var PaySafeCardService = require('./../../../services/server/PaySafeCardService.js');

router.get('/', function (req, res, next) {
    Promise.all([PaySafeCardService.getAll(req.query.page, req.query.limit, req.query.search), PaySafeCardService.getAmountSearchResults(req.query.search)]).then(function (result) {
        res.send({
            amount: result[1],
            payments: result[0]
        });
    }).catch(function (err) {
        next(err);
    });
});

router.put('/:id/payment', function (req, res, next) {
    PaySafeCardService.acceptPayment(req.params.id).then(function () {
        res.send();
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;
