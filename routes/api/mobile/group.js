var express = require('express');
var router = express.Router();
var MobileChatService = require('./../../../services/server/MobileChatService.js');

router.post('/', function (req, res, next) {
    MobileChatService.create(req.body.ownerId, req.body.name, true, req.body.contacts).then(function(chatId){
        res.status(201).send({chatId : chatId});
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;