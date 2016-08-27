var express = require('express');
var router = express.Router();
var CharacterService = require('./../../services/server/CharacterService.js');
var ClanService = require('./../../services/server/ClanService.js');
var LoginService = require('./../../services/server/LoginService.js');

router.get('/', function (req, res, next) {
    CharacterService.getAll(req.query.page, req.query.limit).then(function (characters) {
        res.send(characters);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/:id', function (req, res, next) {
    CharacterService.getById(req.params.id).then(function (character) {
        res.send(character);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/:id/amountFriends', function (req, res, next) {
    CharacterService.getAmountFriends(req.params.id).then(function (amountFriends) {
        res.send({amount: amountFriends});
    }).catch(function (err) {
        next(err);
    });
});

router.get('/:id/skills', function (req, res, next) {
    CharacterService.getSkills(req.params.id).then(function (skills) {
        res.send(skills);
    }).catch(function (err) {
        next(err);
    });
});

router.put('/:id/sex', function (req, res, next) {
    CharacterService.changeSex(req.params.id).then(function () {
        res.send();
    }).catch(function (err) {
        next(err);
    });
});

router.get('/:id/friends', function (req, res, next) {
    CharacterService.getFriends(req.params.id).then(function (friends) {
        res.send(friends);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/:id/searchfriends', function (req, res, next) {
    CharacterService.searchFriends(req.params.id, req.query.search, req.query.order, req.query.page, req.query.limit).then(function (friends) {
        res.send(friends);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/:id/matches', function (req, res, next) {
    CharacterService.getMatchLog(req.params.id, req.query.page, req.query.limit).then(function (matches) {
        res.send(matches);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/:id/comments', function (req, res, next) {
    CharacterService.getComments(req.params.id, req.query.page, req.query.limit).then(function (matches) {
        res.send(matches);
    }).catch(function (err) {
        next(err);
    });
});

router.post('/:id/comments', function (req, res, next) {
    CharacterService.addComment(req.params.id, LoginService(req.session).getUserId(), req.body.comment).then(function () {
        res.send();
    }).catch(function (err) {
        next(err);
    });
});

router.get('/:id/clanwar', function (req, res, next) {
    ClanService.getGameLogByCharacterId(req.params.id, req.query.page, req.query.limit).then(function (matches) {
        res.send(matches);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/:id/levels', function (req, res, next) {
    CharacterService.getLevelUpLog(req.params.id, req.query.page, req.query.limit).then(function (data) {
        res.send(data);
    }).catch(function (err) {
        next(err);
    });
});

router.get('/:id/isOwner', function (req, res, next) {
    if (!LoginService(req.session).isLoggedIn()) {
        return res.send({isOwner: false});
    }
    CharacterService.isCharacterOwnedByAccountId(req.params.id, LoginService(req.session).getUserId()).then(function (isOwner) {
        res.send({isOwner: isOwner});
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
        CharacterService.editEmblem(req.params.id, loginService.getUserId(), file, filename).then(function (url) {
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
        CharacterService.editHeader(req.params.id, loginService.getUserId(), file, filename).then(function (url) {
            res.status(200).send({url: url});
        }).catch(function (err) {
            next(err);
        });
    });
});

router.put('/:id/about', function (req, res, next) {
    var loginService = LoginService(req.session);

    if (!loginService.isLoggedIn()) {
        return res.status(401).send();
    }

    CharacterService.updateAbout(req.params.id, loginService.getUserId(), req.body.about).then(function () {
        res.status(200).send();
    }).catch(function (err) {
        next(err);
    });
});

router.delete('/:id/friend/:friendId', function (req, res, next) {
    var loginService = LoginService(req.session);

    if (!loginService.isLoggedIn()) {
        return res.status(401).send();
    }

    CharacterService.removeFriend(loginService.getUserId(), req.params.id, req.params.friendId).then(function () {
        res.status(200).send();
    }).catch(function (err) {
        next(err);
    });
});

router.post('/:id/skill', function (req, res, next) {
    var loginService = LoginService(req.session);

    if (!loginService.isLoggedIn()) {
        return res.status(401).send();
    }

    CharacterService.addSkill(req.params.id, loginService.getUserId(), req.body.skill).then(function () {
        res.status(201).send();
    }).catch(function (err) {
        next(err);
    });
});

router.delete('/:id/skill/:skillId', function (req, res, next) {
    var loginService = LoginService(req.session);

    if (!loginService.isLoggedIn()) {
        return res.status(401).send();
    }

    CharacterService.removeSkill(req.params.id, loginService.getUserId(), req.params.skillId).then(function () {
        res.status(200).send();
    }).catch(function (err) {
        next(err);
    });
});

module.exports = router;
