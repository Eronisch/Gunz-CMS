var express = require('express');
var router = express.Router();
var CharacterService = require('./../../../services/server/CharacterService.js');

router.get('/', function (req, res, next) {
    Promise.all([CharacterService.getAll(req.query.page, req.query.limit, req.query.search), CharacterService.getAmountSearchResults(req.query.search)])
    .then(function (result) {
        res.send({
            amount : result[1],
            characters : result[0]
        });
    }).catch(function (err) {
        next(err);
    });
});

router.put('/:id', function(req, res, next){
   CharacterService.updateCharacter(req.params.id, req.body.name, req.body.killCount, req.body.deathCount, req.body.redColor, req.body.greenColor, req.body.blueColor).then(function(){
       res.send();
   }).catch(function (err) {
       next(err);
   });
});

module.exports = router;
