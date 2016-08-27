var express = require('express');
var router = express.Router();
var ShopService = require('./../../services/server/ShopService.js');
var LoginService = require('./../../services/server/LoginService.js');

router.get('/categories', function (req, res, next) {
    ShopService.getCategories().then(function (categories) {
        res.send(categories);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/categories/each/item', function (req, res, next) {
    ShopService.getItemsOfEachCategory().then(function (items) {
        res.send(items);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/categories/:id/items', function (req, res, next) {
    ShopService.getShopByCategoryAndSex(req.params.id, req.query.sex, req.query.page, req.query.limit).then(function (items) {
        res.send(items);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/categories/:id', function (req, res, next) {
    ShopService.getCategory(req.params.id).then(function (items) {
        res.send(items);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/item/:id/', function (req, res, next) {
    ShopService.getItem(req.params.id).then(function (items) {
        res.send(items);
    }).catch(function (err) {
        next(err);
    });
});

router.post('/item/:id/purchase', function (req, res, next) {
    var loginService = LoginService(req.session);

    if (!loginService.isLoggedIn()) {
        res.status(403).send();
    }

    ShopService.purchaseItem(req.params.id, loginService.getUserId(), req.body.purchaseType).then(function (isSuccess) {
        res.send({
            isSuccess: isSuccess
        });
    }).catch(function (err) {
        next(err);
    });
});

router.get('/itemOfTheDay', function (req, res, next) {
    ShopService.getItemOfTheDay().then(function (items) {
        res.send(items);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/itemOfTheDay/stock', function (req, res, next) {
    ShopService.getStock().then(function (stock) {
        res.send({stock: stock});
    }).catch(function (err) {
        next(err);
    });
});

router.post('/itemOfTheDay/purchase', function (req, res, next) {
    var loginService = LoginService(req.session);

    if (!loginService.isLoggedIn()) {
        res.status(403).send();
    }

    ShopService.purchaseItemOfTheDay(loginService.getUserId(), req.body.purchaseType).then(function (statusCode) {
        res.send({status: statusCode});
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;