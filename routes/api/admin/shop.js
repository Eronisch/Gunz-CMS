var express = require('express');
var router = express.Router();
var ShopService = require('./../../../services/server/ShopService.js');

router.get('/item', function (req, res, next) {
    Promise.all([ShopService.getAllItems(req.query.page, req.query.limit, req.query.search), ShopService.getAllCountItems(req.query.search)])
        .then(function (result) {
            res.send({
                amount: result[1],
                items: result[0]
            });
        }).catch(function(err){
        next(err);
    })
});

router.delete('/item/:id', function(req, res, next){
    ShopService.removeItem(req.params.id).then(function(){
        res.send();
    }).catch(function(err){
        next(err);
    })
});

router.get('/category', function (req, res, next) {
    Promise.all([ShopService.getAllCategories(req.query.page, req.query.limit, req.query.search), ShopService.getAllCountCategories(req.query.search)])
        .then(function (result) {
            res.send({
                amount: result[1],
                categories: result[0]
            });
        }).catch(function(err){
        next(err);
    })
});

router.delete('/category/:id', function(req, res, next){
    ShopService.removeCategory(req.params.id).then(function(){
        res.send();
    }).catch(function(err){
        next(err);
    })
});

router.post('/category', function (req, res, next) {
   ShopService.addCategory(req.body.name)
        .then(function () {
            res.send();
        }).catch(function(err){
       next(err);
   })
});

router.put('/category/:id', function (req, res, next) {
    ShopService.updateCategory(req.params.id, req.body.name)
        .then(function () {
            res.send();
        }).catch(function(err){
        next(err);
    })
});

router.post('/item', function (req, res, next) {
    req.pipe(req.busboy);

    req.busboy.on('field', function (fieldname, val) {
        req.body[fieldname] = val;
    });

    req.busboy.on('file', function (fieldname, file, fileName) {
        ShopService.addItemToShop(req.body, file, fileName)
            .then(function () {
                res.status(201).send();
            }).catch(function(err){
            next(err);
        })
    });
});

router.put('/item/:id', function (req, res, next) {
    req.pipe(req.busboy);

    req.busboy.on('field', function (fieldname, val) {
        req.body[fieldname] = val;
    });

    req.busboy.on('file', function (fieldname, file, fileName) {
        ShopService.updateImageItemInShop(req.params.id, req.body, file, fileName).catch(function (err) {
            console.log(err);
        });
    });

    req.busboy.on('finish', function () {
        ShopService.updateItemInShop(req.params.id, req.body)
            .then(function () {
                res.status(200).send();
            }).catch(function(err){
            next(err);
        });
    });
});

router.get('/set', function(req, res, next){
    Promise.all([ShopService.getSets(req.query.page, req.query.limit, req.query.search), ShopService.getAmountOfSets(req.query.search)]).then(function(result){
        res.send({
            sets : result[0],
            amount : result[1]
        });
    }).catch(function(err){
        next(err);
    })
});

router.post('/set', function(req, res, next){
    ShopService.addSet(req.body.setId, req.body.itemIds).then(function(){
        res.send();
    }).catch(function(err){
        next(err);
    })
});

router.put('/set/:id', function(req, res, next){
    ShopService.editSet(req.params.id, req.body.itemIds).then(function(){
        res.send();
    }).catch(function(err){
        next(err);
    })
});

router.delete('/set/:id', function(req, res, next){
    ShopService.deleteSet(req.params.id).then(function(){
        res.send();
    }).catch(function(err){
        next(err);
    })
});

module.exports = router;
