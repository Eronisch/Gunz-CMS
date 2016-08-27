var express = require('express');
var router = express.Router();
var ClanService = require('./../../services/server/ClanService.js');
var LoginService = require('./../../services/server/LoginService.js');

router.get('/:id', function (req, res, next) {
    ClanService.getById(req.params.id).then(function (clan) {
        res.send(clan);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/:id/members', function (req, res, next) {
    ClanService.getMembers(req.params.id, req.query.page, req.query.limit).then(function (members) {
        res.send(members);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/:id/members/amount', function (req, res, next) {
    ClanService.getAmountMembers(req.params.id, req.query.limit).then(function (amount) {
        res.send({amount: amount});
    }).catch(function (err) {
        next(err);
    });
});

router.get('/:id/administrators', function (req, res, next) {
    ClanService.getAdministrators(req.params.id, req.query.page, req.query.limit).then(function (administrators) {
        res.send(administrators);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/:id/comments', function (req, res, next) {
    ClanService.getComments(req.params.id, req.query.page, req.query.limit).then(function (comments) {
        res.send(comments);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/:id/matches', function (req, res, next) {
    Promise.all([ClanService.getGameLogs(req.params.id, req.query.page, req.query.limit), ClanService.getAmountGameLogs(req.params.id)])
        .then(function (result) {
            res.send({
                matches: result[0],
                amount: result[1]
            });
        }).catch(function (err) {
        next(err);
    });
});

router.post('/:id/comments', function (req, res, next) {
    var loginService = LoginService(req.session);

    if (!loginService.isLoggedIn()) {
        return res.status(401).send();
    }

    ClanService.addComment(req.params.id, loginService.getUserId(), req.body.comment).then(function () {
        res.status(201).send();
    }).catch(function (err) {
        next(err);
    });
});

router.put('/:id/name', function (req, res, next) {
    var loginService = LoginService(req.session);

    if (!loginService.isLoggedIn()) {
        return res.status(401).send();
    }

    ClanService.editName(req.params.id, loginService.getUserId(), req.body.name).then(function (isUnique) {
        res.status(200).send({isUnique: isUnique});
    }).catch(function (err) {
        next(err);
    });
});

router.put('/:id/emblem', function (req, res, next) {
    var loginService = LoginService(req.session);

    if (!loginService.isLoggedIn()) {
        return res.status(401).send();
    }

    req.pipe(req.busboy);

    req.busboy.on('file', function (fieldname, file, filename) {
        ClanService.editEmblem(req.params.id, loginService.getUserId(), file, filename).then(function (url) {
            res.status(200).send({url: url});
        }).catch(function (err) {
            next(err);
        });
    });
});

router.put('/:id/header', function (req, res, next) {
    var loginService = LoginService(req.session);

    if (!loginService.isLoggedIn()) {
        return res.status(401).send();
    }

    req.pipe(req.busboy);

    req.busboy.on('file', function (fieldname, file, filename) {
        ClanService.editHeader(req.params.id, loginService.getUserId(), file, filename).then(function (url) {
            res.status(200).send({url: url});
        }).catch(function (err) {
            next(err);
        });
    });
});

router.put('/:id/reset', function (req, res, next) {
    var loginService = LoginService(req.session);

    if (!loginService.isLoggedIn()) {
        return res.status(401).send();
    }

    ClanService.resetScore(req.params.id, loginService.getUserId()).then(function () {
        res.status(200).send();
    }).catch(function (err) {
        next(err);
    });
});

router.put('/:id/promote', function (req, res, next) {
    var loginService = LoginService(req.session);

    if (!loginService.isLoggedIn()) {
        return res.status(401).send();
    }

    ClanService.promoteCharacter(req.params.id, loginService.getUserId(), req.body.characterId).then(function () {
        res.status(200).send();
    }).catch(function (err) {
        next(err);
    });
});

router.put('/:id/demote', function (req, res, next) {
    var loginService = LoginService(req.session);

    if (!loginService.isLoggedIn()) {
        return res.status(401).send();
    }

    ClanService.demoteCharacter(req.params.id, loginService.getUserId(), req.body.characterId).then(function () {
        res.status(200).send();
    }).catch(function (err) {
        next(err);
    });
});

router.delete('/:id/members', function (req, res, next) {
    var loginService = LoginService(req.session);

    if (!loginService.isLoggedIn()) {
        return res.status(401).send();
    }

    ClanService.deleteMembers(req.params.id, loginService.getUserId(), req.query.characterIds).then(function () {
        res.status(200).send();
    }).catch(function (err) {
        next(err);
    });
});

router.put('/:id/introduction', function (req, res, next) {
    var loginService = LoginService(req.session);

    if (!loginService.isLoggedIn()) {
        return res.status(401).send();
    }

    ClanService.updateIntroduction(req.params.id, loginService.getUserId(), req.body.introduction).then(function () {
        res.status(200).send();
    }).catch(function (err) {
        next(err);
    });
});

router.get('/:id/isOwner', function (req, res, next) {
    var loginService = LoginService(req.session);

    if (!loginService.isLoggedIn()) {
        return res.send({
            isOwner: false
        });
    }

    ClanService.isAccountMasterOfClan(req.params.id, loginService.getUserId()).then(function (isOwner) {
        res.send({
            isOwner: isOwner
        });
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;