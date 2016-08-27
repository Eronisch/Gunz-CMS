var CharacterModel = require('../../database/server/CharacterModel.js');
var DataContent = require('../../database/DataContent.js');
var Async = require('async');
var PaginationHelper = require('./PaginationHelper.js');
var FriendModel = require('../../database/server/FriendModel.js');
var DateService = require('../../tools/DateService.js');
var PlayerLogModel = require('../../database/server/PlayerLogModel.js');
var CharacterCommentModel = require('../../database/server/CharacterCommentModel.js');
var AccountModel = require('../../database/server/AccountModel.js');
var CharacterLevelUpLogModel = require('../../database/server/CharacterLevelUpLogModel.js');
var FileService = require('../../services/server/FileService.js');
var Fs = require('fs');
var CharacterSkillModel = require('../../database/server/CharacterSkillModel.js');
var HtmlSanitizeService = require('../../services/server/HtmlSanitizeService.js');
var ClanService = require('../../services/server/ClanService.js');
var ServerContext = require('../../database/ServerContext.js');

exports.getCharacterInfo = getCharacterInfo;
exports.getPlayerRanking = getPlayerRanking;
exports.getSearchPlayerRanking = getSearchPlayerRanking;
exports.getCharactersFromAccountId = getCharactersFromAccountId;
exports.getById = getById;
exports.getAmountFriends = getAmountFriends;
exports.getSkills = getSkills;
exports.changeSex = changeSex;
exports.getFriends = getFriends;
exports.searchFriends = searchFriends;
exports.getMatchLog = getMatchLog;
exports.getComments = getComments;
exports.addComment = addComment;
exports.getLevelUpLog = getLevelUpLog;
exports.isCharacterOwnedByAccountId = isCharacterOwnedByAccountId;
exports.editEmblem = editEmblem;
exports.editHeader = editHeader;
exports.updateAbout = updateAbout;
exports.getKdInPercentage = getKdInPercentage;
exports.removeFriend = removeFriend;
exports.getByName = getByName;
exports.getIdByName = getIdByName;
exports.getIdAndNameFromCharacterName = getIdAndNameFromCharacterName;
exports.addSkill = addSkill;
exports.removeSkill = removeSkill;
exports.getAll = getAll;
exports.getAmountCharactersRegistered = getAmountCharactersRegistered;
exports.getAmountSearchResults = getAmountSearchResults;
exports.getAmountPlayerRanking = getAmountPlayerRanking;
exports.getAmountSearchPlayerRanking = getAmountSearchPlayerRanking;
exports.getAvatarUrl = getAvatarUrl;
exports.updateCharacter = updateCharacter;

function updateCharacter(cid, name, killCount, deathCount, redColor, greenColor, blueColor) {
    return ServerContext.CharacterModel.update({
            Name: name,
            KillCount: killCount,
            DeathCount: deathCount,
            nRedColor: redColor,
            nGreenColor: greenColor,
            nBlueColor: blueColor
        },
        {
            where: {
                Cid: cid
            }
        })
}

function getAmountSearchResults(searchText) {
    if (!searchText) {
        searchText = "";
    }

    return CharacterModel.count({
        where: getSearchQuery(searchText)
    });
}

function getAll(page, limit, search) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);

    if (!search) {
        search = "";
    }

    return new Promise(function (resolve, reject) {
        CharacterModel.findAll({
            order: [['Cid', 'DESC']],
            attributes: ['Cid', 'Name', 'PlayTime', 'KillCount', 'DeathCount', 'Level', 'Xp', 'Sex', 'Aid', 'AvatarUrl', 'nRedColor', 'nGreenColor', 'nBlueColor'],
            where: getSearchQuery(search),
            offset: offset,
            limit: limit
        }).then(function (data) {
            var returnArray = [];

            for (var i in data) {
                var player = data[i].dataValues;
                player.PlayTime = getPlayTimeInHours(player.PlayTime);
                player.Kd = getKdInPercentage(player.KillCount, player.DeathCount);
                player.AvatarUrl = getAvatarUrl(player.AvatarUrl);
                returnArray.push(player);
            }

            resolve(returnArray)
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getAmountCharactersRegistered() {
    return CharacterModel.count({where: {DeleteFlag: 0}});
}

function getNewestCharacter() {
    return CharacterModel.findOne({
        attributes: ['Name'],
        where: {DeleteFlag: 0},
        order: 'Cid DESC'
    }).then(function (character) {
        return character ? character.Name : "No one";
    });
}

function getMostAddictedCharacter() {
    return CharacterModel.findOne({
        attributes: ['Name'],
        where: {DeleteFlag: 0},
        order: 'PlayTime DESC'
    }).then(function (character) {
        return character ? character.Name : "No one";
    });
}

function getById(characterId) {
    return new Promise(function (resolve, reject) {
        return CharacterModel.findOne({
            where: {
                Cid: characterId,
                DeleteFlag: 0
            },
            attributes: ['Cid', 'Name', 'Level', 'Sex', 'RegDate', 'LastTime', 'GameCount', 'KillCount', 'DeathCount', 'HeaderUrl', 'About', 'AvatarUrl', 'About']
        }).then(function (character) {
            if (!character) {
                resolve(null);
            }
            var characterValue = character.dataValues;
            characterValue.Kd = getKdInPercentage(characterValue.KillCount, characterValue.DeathCount);
            characterValue.RegDate = DateService.getLongDate(characterValue.RegDate);
            characterValue.LastTime = characterValue.LastTime ? DateService.getLongDate(characterValue.LastTime) : "Never";
            characterValue.AvatarUrl = getAvatarUrl(characterValue.AvatarUrl);
            resolve(characterValue);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getByName(characterName) {
    return new Promise(function (resolve, reject) {
        return CharacterModel.findOne({
            where: {
                Name: characterName,
                DeleteFlag: 0
            },
            attributes: ['Cid', 'Name', 'Level', 'Sex', 'RegDate', 'LastTime', 'GameCount', 'KillCount', 'DeathCount', 'HeaderUrl', 'About', 'AvatarUrl', 'About']
        }).then(function (character) {
            if (!character) {
                resolve(null);
            }
            var characterValue = character.dataValues;
            characterValue.Kd = getKdInPercentage(characterValue.KillCount, characterValue.DeathCount);
            characterValue.RegDate = DateService.getLongDate(characterValue.RegDate);
            characterValue.LastTime = characterValue.LastTime ? DateService.getLongDate(characterValue.LastTime) : "Never";
            characterValue.AvatarUrl = getAvatarUrl(characterValue.AvatarUrl);
            resolve(characterValue);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getIdByName(characterName) {
    return new Promise(function (resolve, reject) {
        return CharacterModel.findOne({
            where: {
                Name: characterName,
                DeleteFlag: 0
            },
            attributes: ['Cid'],
            raw: true
        }).then(function (characterId) {
            resolve(characterId);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getIdAndNameFromCharacterName(characterName) {
    return new Promise(function (resolve, reject) {
        return CharacterModel.findOne({
            where: {
                Name: characterName,
                DeleteFlag: 0
            },
            attributes: ['Cid'],
            raw: true
        }).then(function (character) {
            if (!character) {
                resolve(null);
            }
            character.Name = characterName;
            resolve(character);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function removeFriend(accountId, characterId, friendCharacterId) {
    return new Promise(function (resolve, reject) {
        isCharacterOwnedByAccountId(characterId, accountId).then(function (isOwner) {
            if (!isOwner) {
                return reject(new Error("Given account is not the owner of the character!"));
            }
            FriendModel.destroy({
                where: {
                    Cid: characterId,
                    FriendCid: friendCharacterId
                }
            }).then(function () {
                resolve();
            }).catch(function (err) {
                reject(err);
            });
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getAmountFriends(characterId) {
    return FriendModel.count({
        where: {
            Cid: characterId
        },
        include: [{
            model: CharacterModel,
            required: true,
            attributes: [],
            where: {
                DeleteFlag: 0
            }
        }]
    });
}

function getSkills(characterId) {
    return CharacterSkillModel.findAll({
        where: {
            Cid: characterId
        },
        include: [{
            model: CharacterModel,
            required: true,
            attributes: [],
            where: {
                DeleteFlag: 0
            }
        }],
        attributes: ['Id', 'Skill'],
        raw: true
    });
}

function getCharacterInfo() {

    var amountCharactersRegistered;
    var newestCharacter;
    var mostAddictedCharacter;

    return new Promise(function (resolve, reject) {
        Async.parallel([
            function (callback) {
                getAmountCharactersRegistered().then(function (amount) {
                    amountCharactersRegistered = amount;
                    callback();
                });
            },
            function (callback) {
                getNewestCharacter().then(function (characterName) {
                    newestCharacter = characterName;
                    callback();
                });
            },
            function (callback) {
                getMostAddictedCharacter().then(function (characterName) {
                    mostAddictedCharacter = characterName;
                    callback();
                });
            }], function (err) {
            if (err) {
                return reject(err)
            }
            return resolve({
                amountCharactersRegistered: amountCharactersRegistered,
                newestCharacter: newestCharacter,
                mostAddictedCharacter: mostAddictedCharacter
            })
        });
    });
}

function getPlayerRanking(page, limit) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);

    return new Promise(function (resolve, reject) {
        if (isNaN(page)) {
            return reject(new Error("page is not a number!"));
        }
        CharacterModel.findAll({
            order: [['Level', 'DESC'], [DataContent.literal('KillCount/nullif(DeathCount, 0) '), 'DESC'], ["Cid", "DESC"]],
            attributes: ['Cid', 'Name', 'PlayTime', 'KillCount', 'DeathCount', 'Level', 'Xp', 'AvatarUrl'],
            where: {
                DeleteFlag: 0
            },
            offset: offset,
            limit: limit
        }).then(function (data) {
            var returnArray = [];

            for (var i in data) {
                var player = data[i].dataValues;
                player.PlayTime = getPlayTimeInHours(player.PlayTime);
                player.Kd = getKdInPercentage(player.KillCount, player.DeathCount);
                player.AvatarUrl = getAvatarUrl(player.AvatarUrl);
                returnArray.push(player);
            }

            resolve(returnArray)
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getAmountPlayerRanking() {
    return CharacterModel.count({
        where: {
            DeleteFlag: 0
        }
    });
}

function getAmountSearchPlayerRanking(search) {
    return CharacterModel.count({
        where: {
            DeleteFlag: 0,
            Name: {
                $like: '%' + search + '%'
            }
        }
    });
}

function getSearchPlayerRanking(page, limit, search) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);

    return new Promise(function (resolve, reject) {
        if (isNaN(page)) {
            return reject(new Error("page is not a number!"));
        }
        CharacterModel.findAll({
            order: [['Level', 'DESC'], [DataContent.literal('KillCount/nullif(DeathCount, 0) '), 'DESC'], ["Cid", "DESC"]],
            attributes: ['Cid', 'Name', 'PlayTime', 'KillCount', 'DeathCount', 'Level', 'Xp', 'AvatarUrl'],
            where: {
                DeleteFlag: 0,
                Name: {
                    $like: '%' + search + '%'
                }
            },
            offset: offset,
            limit: limit
        }).then(function (data) {
            var returnArray = [];

            for (var i in data) {
                var player = data[i].dataValues;
                player.PlayTime = getPlayTimeInHours(player.PlayTime);
                player.Kd = getKdInPercentage(player.KillCount, player.DeathCount);
                player.AvatarUrl = getAvatarUrl(player.AvatarUrl);
                returnArray.push(player);
            }

            resolve(returnArray)
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getCharactersFromAccountId(accountId) {
    return CharacterModel.findAll({
        where: {
            AID: accountId,
            DeleteFlag: 0
        },
        attributes: ["Cid", "Level", "Sex", "KillCount", "DeathCount"]
    });
}

function isCharacterOwnedByAccountId(characterId, accountId) {
    return new Promise(function (resolve, reject) {
        return CharacterModel.count({
            where: {
                AID: accountId,
                Cid: characterId,
                DeleteFlag: 0
            }
        }).then(function (amount) {
            resolve(amount === 1);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getKdInPercentage(killCount, deathCount) {
    if (killCount === 0) {
        return 100;
    }
    else {
        return Math.round((100 / (killCount + deathCount)) * killCount * 10) / 10;
    }
}

function changeSex(characterId) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (callback) {
                getById(characterId).then(function (character) {
                    callback(null, character.Sex);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (sex, callback) {
                CharacterModel.update({Sex: sex === 0 ? 1 : 0}, {
                    where: {
                        Cid: characterId,
                        DeleteFlag: 0
                    }
                }).then(function () {
                    callback();
                }).catch(function (err) {
                    callback(err);
                });
            }
        ], function (err) {
            if (err) return reject(err);
            resolve();
        });
    });
}

function getFriends(characterId) {
    return new Promise(function (resolve, reject) {
        return FriendModel.findAll({
            where: {
                Cid: characterId
            },
            attributes: ["Cid", "FriendCid"],
            include: [{
                model: CharacterModel,
                required: true,
                attributes: ["Cid", "Name", "AvatarUrl", "LastTime"],
                as: 'FriendCharacter',
                where: {
                    DeleteFlag: 0
                }
            }],
            order: [['Id', 'DESC']],
            limit: 5
        }).then(function (friends) {

            var friendClanPromises = [];

            for (var i in friends) {
                friendClanPromises.push(getClanFromCharacter(friends[i].FriendCid));
            }

            Promise.all(friendClanPromises).then(function (friendClans) {
                var returnFriends = [];
                for (var i in friendClans) {
                    returnFriends.push({
                        Cid: friends[i].FriendCharacter.Cid,
                        Name: friends[i].FriendCharacter.Name,
                        Clan: friendClans[i],
                        LastTime: friends[i].FriendCharacter.dataValues.LastTime ? DateService.getLongDate(friends[i].FriendCharacter.dataValues.LastTime) : "Never",
                        AvatarUrl: getAvatarUrl(friends[i].FriendCharacter.AvatarUrl)
                    });
                }
                resolve(returnFriends);
            }).catch(function (err) {
                return reject(err);
            });
        }).catch(function (err) {
            return reject(err);
        });
    });
}

function searchFriends(characterId, searchText, order, page, limit) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);

    return new Promise(function (resolve, reject) {
        FriendModel.findAll({
            where: {
                Cid: characterId
            },
            attributes: ['Cid'],
            include: [
                {
                    model: CharacterModel,
                    required: true,
                    as: 'FriendCharacter',
                    attributes: ["Cid", "Name", "LastTime", "AvatarUrl"],
                    where: {
                        'Name': {
                            $like: '%' + searchText + '%'
                        }
                    }
                }
            ],
            order: getFriendsSearchQueryWithOrder(order)
        }).then(function (friends) {

            var friendClanPromises = [];

            var amountFriends = friends.length;

            friends = friends.slice(offset, offset + 8);

            for (var i in friends) {
                friendClanPromises.push(getClanFromCharacter(friends[i].dataValues.Cid));
            }

            Promise.all(friendClanPromises).then(function (friendClans) {
                var returnFriends = [];
                for (var i in friendClans) {
                    returnFriends.push({
                        Cid: friends[i].FriendCharacter.Cid,
                        Name: friends[i].FriendCharacter.Name,
                        Clan: friendClans[i],
                        LastTime: DateService.getLongDate(friends[i].FriendCharacter.dataValues.LastTime),
                        AvatarUrl: getAvatarUrl(friends[i].FriendCharacter.AvatarUrl)
                    });
                }
                resolve({
                    Amount: amountFriends,
                    Friends: returnFriends
                });
            }).catch(function (err) {
                return reject(err);
            });
        }).catch(function (err) {
            return reject(err);
        });
    });
}

function getClanFromCharacter(characterId) {
    return ClanService.getClanByCharacterId(characterId);
}

function getMatchLog(characterId, page, limit) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);

    return new Promise(function (resolve, reject) {
        return PlayerLogModel.findAll({
            where: {
                Cid: characterId
            },
            attributes: ['Id', 'PlayTime', 'Kills', 'Deaths', 'TotalXp'],
            order: 'Id DESC',
            offset: offset,
            limit: limit,
            raw: true
        }).then(function (logs) {
            for (var i in logs) {
                logs[i].PlayTime = 0 > logs[i].PlayTime ? Math.round(logs[i].PlayTime / 60 * 100) / 100 : 0;
            }
            resolve(logs);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getComments(characterId, page, limit) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);

    return new Promise(function (resolve, reject) {
        CharacterCommentModel.findAll({
            where: {
                Cid: characterId
            },
            attributes: ['Id', 'Comment', 'Date', 'Cid', 'AccountId'],
            order: [['Id', 'DESC']],
            include: [{
                model: CharacterModel,
                required: true,
                attributes: ['Cid']
            },
                {
                    model: AccountModel,
                    required: true,
                    attributes: ["Name", "AvatarUrl"]
                }
            ],
            offset: offset,
            limit: limit
        }).then(function (comments) {
            comments.forEach(function (comment) {
                comment.Date = DateService.getLongDate(comment.Date);
                comment.Account.AvatarUrl = getAvatarUrl(comment.Account.AvatarUrl);
            });
            resolve(comments);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function addComment(characterId, accountId, comment) {
    return CharacterCommentModel.create({
        Cid: characterId,
        AccountId: accountId,
        Comment: comment
    });
}

function getLevelUpLog(characterId, page, limit) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);

    return new Promise(function (resolve, reject) {
        CharacterLevelUpLogModel.findAll({
            where: {
                Cid: characterId
            },
            attributes: ['Level', 'Date'],
            order: [['Level', 'DESC']],
            offset: offset,
            limit: limit,
            raw: true
        }).then(function (levels) {
            levels.forEach(function (level) {
                level.Date = DateService.getLongDate(level.Date);
            });
            resolve(levels);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function editEmblem(characterId, userId, file, filename) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (callback) {
                if (FileService.isImage(filename)) {
                    callback();
                }
                else {
                    callback(new Error("Emblem is not an image!"));
                }
            },
            function (callback) {
                createMainCharacterFolder().then(callback).catch(function (err) {
                    callback(err);
                });
            },
            function (callback) {
                createCharacterFolder(characterId).then(callback).catch(function (err) {
                    callback(err);
                });
            },
            function (callback) {
                saveEmblem(characterId, file, filename).then(function (clientEmblemPath) {
                    callback(null, clientEmblemPath);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (clientEmblemPath, callback) {
                var avatarUrl = clientEmblemPath;
                CharacterModel.update({
                    AvatarUrl: avatarUrl
                }, {where: {Cid: characterId}}).then(function () {
                    callback(null, avatarUrl);
                }).catch(function (err) {
                    console.log(err);
                    callback(err);
                });
            }
        ], function (err, clientEmblemPath) {
            if (err) return reject(err);
            resolve(clientEmblemPath);
        });
    });
}

function editHeader(characterId, userId, file, filename) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (callback) {
                if (FileService.isImage(filename)) {
                    callback();
                }
                else {
                    callback(new Error("Header is not an image!"));
                }
            },
            function (callback) {
                createCharacterFolder().then(callback).catch(function (err) {
                    callback(err);
                });
            },
            function (callback) {
                createCharacterFolder(characterId).then(callback).catch(function (err) {
                    callback(err);
                });
            },
            function (callback) {
                saveHeader(characterId, file, filename).then(function (clientHeaderPath) {
                    callback(null, clientHeaderPath);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (clientHeaderPath, callback) {
                var headerUrl = clientHeaderPath;
                CharacterModel.update({
                    HeaderUrl: headerUrl
                }, {where: {Cid: characterId}}).then(function () {
                    callback(null, headerUrl);
                }).catch(function (err) {
                    callback(err);
                });
            }
        ], function (err, clientHeaderPath) {
            if (err) return reject(err);
            resolve(clientHeaderPath);
        });
    });
}

function updateAbout(characterId, accountId, about) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (callback) {
                isCharacterOwnedByAccountId(characterId, accountId).then(function (isOwner) {

                    if (!isOwner) {
                        return callback(new Error("Given account is not the owner of the character!"));
                    }

                    callback();
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (callback) {
                CharacterModel.update({
                    About: HtmlSanitizeService(about)
                }, {
                    where: {
                        Cid: characterId
                    }
                }).then(function () {
                        callback();
                    })
                    .catch(function (err) {
                        callback(err);
                    });
            }
        ], function (err) {
            if (err) return reject(err);
            console.log(err);
            resolve();
        });
    });
}

function addSkill(characterId, accountId, skill) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (callback) {
                isCharacterOwnedByAccountId(characterId, accountId).then(function (isOwner) {
                    if (!isOwner) {
                        return callback(new Error("Given account is not the owner of the character!"));
                    }
                    callback();
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (callback) {
                CharacterSkillModel.create({
                    Cid: characterId,
                    Skill: skill
                }).then(function () {
                    callback();
                }).catch(callback);
            }
        ], function (err) {
            if (err) return reject(err);

            resolve();
        });
    });
}

function removeSkill(characterId, accountId, skillId) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (callback) {
                isCharacterOwnedByAccountId(characterId, accountId).then(function (isOwner) {
                    if (!isOwner) {
                        return callback(new Error("Given account is not the owner of the character!"));
                    }
                    callback();
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (callback) {
                CharacterSkillModel.destroy({
                    where: {
                        Id: skillId
                    }
                }).then(function () {
                    callback();
                }).catch(callback);
            }
        ], function (err) {
            if (err) return reject(err);

            resolve();
        });
    });
}

function getAvatarUrl(avatar) {
    return avatar ? avatar : "/img/no-emblem (1).jpg";
}

function saveEmblem(characterId, file, filename) {
    return new Promise(function (resolve, reject) {
        var clientEmblemPath = "/img/character/" + characterId + "/emblem." + FileService.getExtension(filename);
        var fstream = Fs.createWriteStream(__dirname + "../../../public/" + clientEmblemPath);
        file.pipe(fstream);
        fstream.on('close', function () {
            resolve(clientEmblemPath);
        });
        fstream.on('error', function (err) {
            console.log(err);
            reject(err);
        });
    });
}

function saveHeader(characterId, file, filename) {
    return new Promise(function (resolve, reject) {
        var clientHeaderPath = "/img/character/" + characterId + "/header." + FileService.getExtension(filename);
        var fstream = Fs.createWriteStream(__dirname + "../../../public/" + clientHeaderPath);
        file.pipe(fstream);
        fstream.on('close', function () {
            resolve(clientHeaderPath);
        });
        fstream.on('error', function (err) {
            console.log(err);
            reject(err);
        });
    });
}

function createMainCharacterFolder() {
    return new Promise(function (resolve, reject) {
        Fs.stat(__dirname + '../../../public/img/character', function (err) {

            if (!err) {
                return resolve();
            }

            Fs.mkdir(__dirname + '../../../public/img/character', function (err) {
                if (err) return reject(err);
                resolve();
            });
        });
    });
}

function createCharacterFolder(characterId) {
    return new Promise(function (resolve, reject) {
        Fs.stat(__dirname + '../../../public/img/character/' + characterId, function (err) {
            if (!err) return resolve();

            Fs.mkdir(__dirname + '../../../public/img/character/' + characterId, function (err) {
                if (err) return reject(err);
                resolve();
            });
        });
    });
}

function getFriendsSearchQueryWithOrder(order) {
    switch (order) {
        case 'alphabetical':
        {
            return [[{model: CharacterModel, as: 'FriendCharacter'}, 'Name', 'ASC']];
        }
        case 'lastAdded':
        {
            return [['Id', 'DESC']];
        }
        case 'lastActive':
        {
            return [[{model: CharacterModel, as: 'FriendCharacter'}, 'LastTime', 'DESC']];
        }
        default :
        {
            return [];
        }
    }
}

function getPlayTimeInHours(playTime) {
    return playTime > 0 ? (Math.round(playTime / 60 / 60 * 100) / 100) : 0
}

function getSearchQuery(search) {

    if (search == null) {
        search = "";
    }

    var whereQuery = {
        DeleteFlag: 0,
        $or: [{
            Name: {
                $like: '%' + search + '%'
            }
        }]
    };

    if (!isNaN(search)) {
        whereQuery['$or'].push({
            Cid: search
        });
        whereQuery['$or'].push({
            Aid: search
        });
    }

    return whereQuery
}
