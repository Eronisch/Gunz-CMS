var express = require('express');
var router = express.Router();
var ItemRotationService = require('./../../../services/server/ItemRotationService.js');

router.get('/', function(req, res, next){
    var promise = req.query.year && req.query.month
        ? ItemRotationService.getItemsByYearAndMonth(req.query.year, req.query.month)
        : ItemRotationService.getItems();

    promise.then(function(items){
        res.send(items);
    }).catch(function (err) {
        next(err);
    });
});

router.delete('/:id', function(req, res, next) {
    ItemRotationService.deleteItem(req.params.id).then(function(){
        res.send();
    }).catch(function (err) {
        next(err);
    });
});

router.post('/', function(req, res, next) {
    ItemRotationService.addItem(req.body.itemId, req.body.year, req.body.month).then(function(){
        res.status(201).send();
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;