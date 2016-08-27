var express = require('express');
var router = express.Router();
var ClanService = require('./../../../services/server/ClanService.js');

router.get('/', function (req, res, next) {
    Promise.all([ClanService.getAllAdmin(req.query.page, req.query.limit, req.query.search), ClanService.getAmountAllAdmin(req.query.search)])
        .then(function (result) {
            res.send({
                amount: result[1],
                clans: result[0]
            });
        }).catch(function (err) {
        next(err);
    });
});

module.exports = router;
