var ClanService = require('./../../services/server/ClanService.js');
var CharacterService = require('./../../services/server/CharacterService.js');
var express = require('express');
var router = express.Router();

router.get('/clan', function (req, res, next) {
    Promise.all([ClanService.getRanking(req.query.page, req.query.limit), ClanService.getAmountRanking()]) .then(function (clanData) {
        res.send({
            amount : clanData[1],
            clans : clanData[0]
        });
    }).catch(function (err) {
        next(err);
    });
});

router.get('/clan/:search', function (req, res, next) {
    Promise.all([ClanService.getSearchRanking(req.query.page, req.query.limit, req.params.search), ClanService.getAmountSearchRanking(req.params.search)]) .then(function (clanData) {
        res.send({
            amount : clanData[1],
            clans : clanData[0]
        });
    }).catch(function (err) {
        next(err);
    });
});

router.get('/individual', function (req, res, next) {
    Promise.all([ CharacterService.getPlayerRanking(req.query.page, req.query.limit),  CharacterService.getAmountPlayerRanking()])
   .then(function (playerData) {
        res.send({
            amount : playerData[1],
            characters : playerData[0]
        });
    }).catch(function (err) {
        next(err);
    });
});

router.get('/individualSearch', function (req, res, next) {
    Promise.all([CharacterService.getSearchPlayerRanking(req.query.page, req.query.limit, req.query.search),  CharacterService.getAmountSearchPlayerRanking(req.query.search)])
        .then(function (playerData) {
            res.send({
                amount : playerData[1],
                characters : playerData[0]
            });
        }).catch(function (err) {
        next(err);
    });
});

module.exports = router;