var express = require('express');
var router = express.Router();
var LoginService = require('./../../services/server/LoginService.js');

router.put('/logout', function (req, res) {
    req.session.destroy();
    res.send();
});

router.get('/userId', function (req, res) {
    res.send({
        accountId  : LoginService(req.session).getUserId()
    });
});

module.exports = router;