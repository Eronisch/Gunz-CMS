var express = require('express');
var stream = require('stream');
var router = express.Router();
var ShopService = require('./../../../services/server/ShopService.js');

router.get('/', function (req, res, next) {
    Promise.all([ShopService.getAllItemsOfTheDay(req.query.page, req.query.limit, req.query.search), ShopService.getAllAmountItemsOfTheDay(req.query.search)])
        .then(function (result) {
            res.send({
                amount: result[1],
                items: result[0]
            });
        }).catch(function (err) {
        next(err);
    });
});

router.post('/', function (req, res, next) {
    var copiedFileOutput = new stream.Readable();
    var copiedFileName;

    req.pipe(req.busboy);

    req.busboy.on('field', function (fieldname, val) {
        req.body[fieldname] = val;
    });

    req.busboy.on('file', function (fieldname, file, fileName) {
        file.on('data', function(data){
            copiedFileOutput.push(data);
        });

        file.on('end', function(){
            copiedFileOutput.push(null);
        });

        copiedFileName = fileName;
        file.resume();
    });

    req.busboy.on('finish', function(){
        ShopService.addItemOfTheDay(req.body, copiedFileOutput, copiedFileName)
            .then(function () {
                res.status(201).send();
            }).catch(function (err) {
            next(err);
        });
    });
});

router.put('/:id', function (req, res, next) {
    req.pipe(req.busboy);

    req.busboy.on('field', function (fieldname, val) {
        req.body[fieldname] = val;
    });

    req.busboy.on('file', function (fieldname, file, fileName) {
        ShopService.updateItemOfTheDayImage(req.params.id, file, fileName).catch(function (err) {
            next(err);
        });
    });

    req.busboy.on('finish', function () {
        ShopService.updateItemOfTheDay(req.params.id, req.body)
            .then(function () {
                res.status(200).send();
            }).catch(function (err) {
            next(err);
        });
    });
});

router.delete('/:id', function (req, res, next) {
    ShopService.deleteItemOfTheDayDb(req.params.id)
        .then(function () {
            res.send();
        }).catch(function (err) {
        next(err);
    });
});

module.exports = router;
