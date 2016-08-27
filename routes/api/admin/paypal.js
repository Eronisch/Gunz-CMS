var express = require('express');
var router = express.Router();
var PaypalService = require('./../../../services/server/PaypalService.js');

router.get('/', function (req, res, next) {
    Promise.all([PaypalService.getAll(req.query.page, req.query.limit, req.query.search), PaypalService.getAmountAll(req.query.search)])
        .then(function (result) {
            res.send({
                amount: result[1],
                payments: result[0]
            });
        }).catch(function (err) {
        next(err);
    });
});

module.exports = router;
