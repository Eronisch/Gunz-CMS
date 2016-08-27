var ClanModel = require('../../database/server/ClanModel.js');
var ClanMembersModel = require('../../database/server/ClanMemberModel.js');
var CharacterModel = require('../../database/server/CharacterModel.js');
var Async = require('async');
var DataContent = require('../../database/DataContent.js');
var PaginationHelper = require('./PaginationHelper.js');
var DateService = require('../../tools/DateService.js');
var CharacterService = require('../../services/server/CharacterService.js');
var ClanGameLogModel = require('../../database/server/ClanGameLogModel.js');
var AccountModel = require('../../database/server/AccountModel.js');
var AccountService = require('../../services/server/AccountService.js');
var ClanCommentModel = require('./../../database/server/ClanCommentModel.js');
var MapModel = require('../../database/server/MapModel.js');
var FileService = require('../../services/server/FileService.js');
var Fs = require('fs');

exports.getRanking = getRanking;
exports.getById = getById;
exports.getMembers = getMembers;
exports.getAmountMembers = getAmountMembers;
exports.getAdministrators = getAdministrators;
exports.getComments = getComments;
exports.getGameLogs = getGameLogs;
exports.addComment = addComment;
exports.editName = editName;
exports.editEmblem = editEmblem;
exports.editHeader = editHeader;
exports.resetScore = resetScore;
exports.promoteCharacter = promoteCharacter;
exports.demoteCharacter = demoteCharacter;
exports.deleteMembers = deleteMembers;
exports.updateIntroduction = updateIntroduction;
exports.isAccountMasterOfClan = isAccountMasterOfClan;
exports.getClansFromAccount = getClansFromAccount;
exports.getAmountGameLogs = getAmountGameLogs;
exports.getAmountClans = getAmountClans;
exports.getClanByCharacterId = getClanByCharacterId;
exports.getGameLogByCharacterId = getGameLogByCharacterId;
exports.hasCharacterWinningClan = hasCharacterWinningClan;
exports.getSearchRanking = getSearchRanking;
exports.getAmountRanking = getAmountRanking;
exports.getAmountSearchRanking = getAmountSearchRanking;
exports.getAllAdmin = getAllAdmin;
exports.getAmountAllAdmin = getAmountAllAdmin;

function getAmountClans() {
    return ClanModel.count({
        where: {
            DeleteFlag: 0
        }
    });
}

function getAllAdmin(page, limit, search) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);

    if (!search) {
        search = "";
    }

    return new Promise(function (resolve, reject) {
        ClanModel.findAll({
            order: [["Clid", "DESC"]],
            attributes: ['Clid', 'Name', 'Wins', 'Draws', 'Losses', 'Point', 'EmblemUrl'],
            where: {
                DeleteFlag: 0,
                $or: [
                    {
                        'Name': {
                            $like: '%' + search + '%'
                        }
                    },
                    DataContent.literal("Owner.Name LIKE " + DataContent.escape("%" + search + "%"))]
            },
            include: [{
                model: CharacterModel,
                required: true,
                attributes: ["Name"],
                as: 'Owner'
            }],
            offset: offset,
            limit: limit
        }).then(function (clans) {
            clans.forEach(function (clan) {
                clan.dataValues.EmblemUrl = getClanEmblemUrl(clan.dataValues.EmblemUrl);
            });
            resolve(clans);
        }).catch(function (err) {
            reject(err);
        })
    });
}

function getAmountAllAdmin(search) {
    if (!search) {
        search = "";
    }
    return ClanModel.count({
        where: {
            DeleteFlag: 0,
            $or: [
                {
                    'Name': {
                        $like: '%' + search + '%'
                    }
                },
                DataContent.literal("Owner.Name LIKE " + DataContent.escape("%" + search + "%"))]
        },
        include: [{
            model: CharacterModel,
            required: true,
            as: 'Owner'
        }]
    })
}

function getRanking(page, limit) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);

    return new Promise(function (resolve, reject) {

        if (isNaN(page)) {
            return reject(new Error("page is not a number!"));
        }

        ClanModel.findAll({
            order: [["Point", "DESC"], ["Wins", "DESC"], ["Name", "DESC"]],
            attributes: ['Clid', 'Name', 'Wins', 'Draws', 'Losses', 'Point', 'EmblemUrl'],
            where: {
                DeleteFlag: 0
            },
            offset: offset,
            limit: limit
        }).then(function (clans) {
            clans.forEach(function (clan) {
                clan.dataValues.EmblemUrl = getClanEmblemUrl(clan.dataValues.EmblemUrl);
            });
            resolve(clans);
        }).catch(function (err) {
            reject(err);
        })
    });
}

function getSearchRanking(page, limit, search) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);

    return new Promise(function (resolve, reject) {

        if (isNaN(page)) {
            return reject(new Error("page is not a number!"));
        }

        ClanModel.findAll({
            order: [["Point", "DESC"], ["Wins", "DESC"], ["Name", "DESC"]],
            attributes: ['Clid', 'Name', 'Wins', 'Draws', 'Losses', 'Point', 'EmblemUrl'],
            where: {
                DeleteFlag: 0,
                Name: {
                    $like: '%' + search + '%'
                }
            },
            offset: offset,
            limit: limit
        }).then(function (clans) {
            clans.forEach(function (clan) {
                clan.dataValues.EmblemUrl = getClanEmblemUrl(clan.dataValues.EmblemUrl);
            });
            resolve(clans);
        }).catch(function (err) {
            reject(err);
        })
    });
}

function getAmountRanking() {
    return ClanModel.count({
        where: {
            DeleteFlag: 0
        }
    })
}

function getAmountSearchRanking(search) {
    return ClanModel.count({
        where: {
            DeleteFlag: 0,
            Name: {
                $like: '%' + search + '%'
            }
        }
    })
}

function getById(id) {
    return new Promise(function (resolve, reject) {
        ClanModel.findOne({
            where: {
                "ClanId": id,
                DeleteFlag: 0
            },
            attributes: ["ClanId", "MasterCid", "Name", "Wins", "Losses", "Draws", "RegDate", "EmblemUrl", "FacebookUrl", "TwitterUrl", "GooglePlusUrl", "HeaderUrl", "Introduction"],
            raw: true
        }).then(function (clan) {
            if (clan) {
                clan.RegDate = DateService.getLongDate(clan.RegDate);
                clan.EmblemUrl = getClanEmblemUrl(clan.EmblemUrl);
            }
            resolve(clan);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getMembers(id, page, limit) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);

    return new Promise(function (resolve, reject) {
        ClanMembersModel.findAll({
            where: {
                Clid: id
            },
            attributes: ["Grade"],
            include: [{
                model: CharacterModel,
                required: true,
                attributes: ["Cid", "Name", "KillCount", "DeathCount", "Level", "LastTime", "AvatarUrl"],
                where: {
                    DeleteFlag: 0
                }
            }],
            order: [["Cmid", "DESC"]],
            offset: offset,
            limit: limit
        }).then(function (members) {
            members.forEach(function (member) {
                member.Character.dataValues.Kd = CharacterService.getKdInPercentage(member.Character.dataValues.KillCount, member.Character.dataValues.DeathCount);
                member.Character.dataValues.LastTime = member.Character.dataValues.LastTime ? DateService.getLongDate(member.Character.dataValues.LastTime) : "Never";
                member.Character.dataValues.AvatarUrl = CharacterService.getAvatarUrl(member.Character.dataValues.AvatarUrl);
            });
            resolve(members);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getAmountMembers(id) {
    return ClanMembersModel.count({
        where: {
            Clid: id
        },
        include: [{
            model: ClanModel, required: true, attributes: [], where: {
                DeleteFlag: 0
            }
        }]
    });
}

function getAmountGameLogs(id) {
    return ClanGameLogModel.count({
        where: {
            $or: [{"WinnerClanId": id}, {"LoserClanId": id}]
        },
        include: [{
            model: ClanModel, required: true, attributes: [], as: 'WinnerClan', where: {
                DeleteFlag: 0
            }
        },
            {
                model: ClanModel, required: true, attributes: [], as: 'LoserClan', where: {
                DeleteFlag: 0
            }
            }
        ]
    });
}

function getAdministrators(id, page, limit) {
    return new Promise(function (resolve, reject) {
        page = PaginationHelper.getPage(page);
        var offset = PaginationHelper.getOffset(page, limit);

        ClanMembersModel.findAll({
            where: {
                Clid: id,
                $or: [{"grade": 1}, {"grade": 2}]
            },
            attributes: ["Grade"],
            include: [{model: CharacterModel, required: true, attributes: ["Cid", "Name", "AvatarUrl"]}, {
                model: ClanModel, required: true, attributes: [], where: {
                    DeleteFlag: 0
                }
            }],
            order: [["Grade", "DESC"], ["Cmid", "DESC"]],
            offset: offset,
            limit: limit
        }).then(function (clanMembers) {
            clanMembers.forEach(function (clanMember) {
                clanMember.dataValues.Character.dataValues.AvatarUrl = CharacterService.getAvatarUrl(clanMember.dataValues.Character.dataValues.AvatarUrl);
            });
            resolve(clanMembers);
        }).catch(reject);
    });
}

function getComments(id, page, limit) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);

    return new Promise(function (resolve, reject) {
        ClanCommentModel.findAll({
            where: {
                ClanId: id
            },
            attributes: ["Id", "Comment", "Date"],
            include: [{model: AccountModel, required: true, attributes: ["UserId", "AvatarUrl"]}, {
                model: ClanModel, required: true, attributes: [], where: {
                    DeleteFlag: 0
                }
            }],
            order: [["Id", "DESC"]],
            offset: offset,
            limit: limit
        }).then(function (comments) {
            comments.forEach(function (comment) {
                comment.dataValues.Date = DateService.getLongDate(comment.dataValues.Date);
                comment.dataValues.Account.dataValues.AvatarUrl = AccountService.getAvatarUrl(comment.dataValues.Account.dataValues.AvatarUrl);
            });
            resolve(comments);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getGameLogs(id, page, limit) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);

    return new Promise(function (resolve) {
        ClanGameLogModel.findAll({
            where: {
                $or: [{"WinnerClanId": id}, {"LoserClanId": id}]
            },
            attributes: ["WinnerClanId", "LoserClanId", "WinnerClanName", "LoserClanName", "RoundWins", "RoundLosses", "WinnerMembers", "LoserMembers", "RegDate"],
            include: [{
                model: ClanModel, required: true, attributes: ["EmblemUrl"], as: 'WinnerClan', where: {
                    DeleteFlag: 0
                }
            },
                {
                    model: ClanModel, required: true, attributes: ["EmblemUrl"], as: 'LoserClan', where: {
                    DeleteFlag: 0
                }
                },
                {model: MapModel, required: false, attributes: ["Name"]}
            ],
            offset: offset,
            limit: limit,
            order: [["Id", "DESC"]]
        }).then(function (matches) {
            var numberClanId = parseInt(id);
            var matchPromises = [];
            matches.forEach(function (match) {
                var matchPromise = new Promise(function (matchResolve, matchReject) {
                    var newMatch = match.dataValues;
                    var winnerMembers = match.dataValues.WinnerMembers.substring(0, match.dataValues.WinnerMembers.length - 1).split(' ');
                    var loserMembers = match.dataValues.LoserMembers.substring(0, match.dataValues.LoserMembers.length - 1).split(' ');
                    newMatch.IsWinner = numberClanId === match.WinnerClanId;
                    newMatch.RegDate = DateService.getLongDate(match.RegDate);
                    newMatch.OpponentClanUrl = "/clan/view/" + (match.IsWinner ? match.LoserClanId : match.WinnerClanId);
                    newMatch.WinnerClan.EmblemUrl = getClanEmblemUrl(newMatch.WinnerClan.EmblemUrl);
                    newMatch.LoserClan.EmblemUrl = getClanEmblemUrl(newMatch.LoserClan.EmblemUrl);
                    newMatch.WinnerMembers = [];
                    newMatch.LoserMembers = [];
                    newMatch.Map = newMatch.Map ? newMatch.Map.dataValues.Name : "Unknown";

                    var winnerMemberPromises = [];
                    var loserMemberPromises = [];

                    winnerMembers.forEach(function (username) {
                        winnerMemberPromises.push(CharacterService.getIdAndNameFromCharacterName(username));
                    });

                    loserMembers.forEach(function (username) {
                        loserMemberPromises.push(CharacterService.getIdAndNameFromCharacterName(username));
                    });

                    Promise.all(winnerMemberPromises).then(function (characters) {
                        characters.forEach(function (character) {
                            newMatch.WinnerMembers.push(character);
                        });
                    });

                    Promise.all(loserMemberPromises).then(function (characters) {
                        characters.forEach(function (character) {
                            newMatch.LoserMembers.push(character);
                        });
                    });

                    Promise.all(winnerMemberPromises.concat(loserMemberPromises)).then(function () {
                        matchResolve(newMatch);
                    }).catch(function (err) {
                        matchReject(err);
                    });
                });
                matchPromises.push(matchPromise);
            });

            Promise.all(matchPromises).then(function (matches) {
                resolve(matches);
            }).catch(function (err) {
                reject(err);
            });
        });
    });
}

function addComment(clanId, accountId, comment) {
    return ClanCommentModel.create({
        ClanId: clanId,
        AccountId: accountId,
        Comment: comment
    });
}

function editName(clanId, accountId, name) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (callback) {
                isAccountMasterOfClan(clanId, accountId).then(function (isOwner) {
                    if (isOwner) {
                        callback();
                    } else {
                        callback(new Error("Character is not the master of the clan!"));
                    }
                });
            },
            function (callback) {
                ClanModel.count({
                    where: {
                        Name: name,
                        ClanId: {
                            $not: clanId
                        },
                        DeleteFlag: 0
                    }
                }).then(function (amount) {
                    callback(null, amount === 0);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (isUnique, callback) {
                if (isUnique) {
                    ClanModel.update({
                        Name: name
                    }, {
                        where: {
                            ClanId: clanId
                        }
                    }).then(function () {
                        callback(null, isUnique);
                    }).catch(function (err) {
                        callback(err);
                    });
                } else {
                    callback(null, false);
                }
            }
        ], function (err, isUnique) {
            if (err) return reject(err);
            resolve(isUnique);
        });
    });
}

function editEmblem(clanId, userId, file, filename) {
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
                saveEmblem(clanId, file, filename).then(function (clientEmblemPath) {
                    callback(null, clientEmblemPath);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (filename, callback) {
                ClanModel.update({
                    EmblemUrl: filename,
                    EmblemChecksum: 1
                }, {where: {ClanId: clanId}}).then(function () {
                    callback(null, filename);
                }).catch(function (err) {
                    console.log(err);
                    callback(err);
                });
            }
        ], function (err, filename) {
            if (err) return reject(err);
            resolve(getClanEmblemUrl(filename));
        });
    });
}

function editHeader(clanId, userId, file, filename) {
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
                createMainClanFolder().then(callback).catch(function (err) {
                    callback(err);
                });
            },
            function (callback) {
                createClanFolder(clanId).then(callback).catch(function (err) {
                    callback(err);
                });
            },
            function (callback) {
                saveHeader(clanId, file, filename).then(function (clientHeaderPath) {
                    callback(null, clientHeaderPath);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (clientHeaderPath, callback) {
                var headerUrl = clientHeaderPath;
                ClanModel.update({
                    HeaderUrl: headerUrl
                }, {where: {ClanId: clanId}}).then(function () {
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

function resetScore(clanId, accountId) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (callback) {
                isAccountMasterOfClan(clanId, accountId).then(function (isOwner) {
                    callback(null, isOwner);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (isOwner, callback) {

                if (!isOwner) {
                    return callback(new Error("Character is not the owner"))
                }

                ClanModel.update({
                    Wins: 0,
                    Losses: 0,
                    Draws: 0,
                    Point: 1000,
                    TotalPoints: 0
                }, {
                    where: {
                        "ClanId": clanId
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

function promoteCharacter(clanId, accountId, characterId) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (callback) {
                isAccountMasterOfClan(clanId, accountId).then(function (isOwner) {
                    callback(null, isOwner);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (isOwner, callback) {

                if (!isOwner) {
                    return callback(new Error("Character is not the owner"))
                }

                ClanMembersModel.update({
                    Grade: 2
                }, {
                    where: {
                        Clid: clanId,
                        Cid: characterId
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

function demoteCharacter(clanId, accountId, characterId) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (callback) {
                isAccountMasterOfClan(clanId, accountId).then(function (isOwner) {
                    callback(null, isOwner);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (isOwner, callback) {

                if (!isOwner) {
                    return callback(new Error("Character is not the owner"))
                }

                ClanMembersModel.update({
                    Grade: 9
                }, {
                    where: {
                        Clid: clanId,
                        Cid: characterId
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

function deleteMembers(clanId, accountId, characterIds) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (callback) {
                getById(clanId).then(function (clan) {
                    callback(null, clan);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (clan, callback) {
                isAccountMasterOfClan(clanId, accountId).then(function (isOwner) {
                    callback(null, clan.MasterCid, isOwner);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (masterId, isOwner, callback) {

                if (!isOwner) {
                    return callback(new Error("Character is not the owner"))
                }

                ClanMembersModel.destroy({
                    where: {
                        Clid: clanId,
                        Cid: {$ne: masterId, $in: characterIds}
                    }
                }).then(function () {
                    callback()
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

function getClansFromAccount(accountId) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (callback) {
                CharacterService.getCharactersFromAccountId(accountId).then(function (characters) {
                    var characterIds = [];

                    characters.forEach(function (character) {
                        characterIds.push(character.Cid);
                    });

                    callback(null, characterIds);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (characterIds, callback) {
                ClanMembersModel.findAll({
                    where: {
                        Cid: {
                            $in: characterIds
                        }
                    },
                    attributes: ['Clid'],
                    raw: true
                }).then(function (clans) {
                    var clanIds = [];

                    clans.forEach(function (clan) {
                        clanIds.push(clan.Clid);
                    });

                    callback(null, clanIds);
                }).catch(function (err) {
                    throw err;
                });
            },
            function (clanIds, callback) {
                ClanModel.findAll({
                    where: {
                        ClanId: {
                            $in: clanIds
                        },
                        DeleteFlag: 0
                    },
                    attributes: ['ClanId', 'Name', 'Wins', 'Draws', 'Losses', 'TotalPoints', 'EmblemUrl'],
                    order: [["CLID", "DESC"]]
                }).then(function (clans) {
                    clans.forEach(function (clan) {
                        clan.dataValues.EmblemUrl = getClanEmblemUrl(clan.dataValues.EmblemUrl);
                    });
                    callback(null, clans);
                }).catch(function (err) {
                    callback(err);
                });
            }
        ], function (err, clans) {
            if (err) return reject(err);
            resolve(clans);
        });
    });
}

function getGameLogByCharacterId(characterId, page, limit) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);
    limit = parseInt(limit);

    return new Promise(function (resolve, reject) {
            Async.waterfall([
                    function (callback) {
                        getClanIdByCharacterId(characterId).then(function (clanId) {
                            if (clanId) {
                                callback(null, clanId);
                            } else {
                                callback(true);
                            }
                        }).catch(function (err) {
                            callback(err);
                        });
                    },
                    function (clanId, callback) {
                        CharacterService.getById(characterId).then(function (character) {
                            callback(null, clanId, character.Name);
                        }).catch(function (err) {
                            callback(err);
                        });
                    },
                    function (clanId, characterName, callback) {
                        ClanGameLogModel.findAll({
                            where: {
                                $or: [{"WinnerClanId": clanId}, {"LoserClanId": clanId}]
                            },
                            attributes: ['WinnerMembers', 'LoserMembers', 'RegDate', 'WinnerClid', 'LoserClid', 'RoundWins', 'RoundLosses'],
                            include: [
                                {
                                    model: ClanModel,
                                    required: true,
                                    attributes: ["EmblemUrl", 'Name'],
                                    as: 'WinnerClan',
                                    where: {
                                        DeleteFlag: 0
                                    }
                                },
                                {
                                    model: ClanModel,
                                    required: true,
                                    attributes: ["EmblemUrl", 'Name'],
                                    as: 'LoserClan',
                                    where: {
                                        DeleteFlag: 0
                                    }
                                }
                            ],
                            order: [["Id", "DESC"]]
                        }).then(function (gameLogs) {
                            var gameLogPromises = [];
                            var hasReachedLimit = false;

                            for (var g in gameLogs) {

                                if (hasReachedLimit) {
                                    break;
                                }

                                var gameLog = gameLogs[g].dataValues;

                                var characters = gameLog.WinnerClid === clanId ? gameLog.WinnerMembers.split(' ') : gameLog.LoserMembers.split(' ');

                                for (var i in characters) {
                                    if (characters[i] === characterName) {
                                        var gamePromise = new Promise(function (resolve, reject) {

                                            var winnerMembers = gameLog.WinnerMembers.substring(0, gameLog.WinnerMembers.length - 1).split(' ');
                                            var loserMembers = gameLog.LoserMembers.substring(0, gameLog.LoserMembers.length - 1).split(' ');

                                            var returnLog = gameLog;
                                            returnLog.WinnerMembers = gameLog.LoserMembers = gameLog.LoserMembers.substring(0, gameLog.LoserMembers.length - 1).split(' ');
                                            returnLog.RegDate = DateService.getLongDate(gameLog.RegDate);
                                            returnLog.WinnerMembers = [];
                                            returnLog.LoserMembers = [];
                                            returnLog.HasWinningClan = false;
                                            returnLog.WinnerClan.dataValues.EmblemUrl = getClanEmblemUrl(returnLog.WinnerClan.dataValues.EmblemUrl);
                                            returnLog.LoserClan.dataValues.EmblemUrl = getClanEmblemUrl(returnLog.LoserClan.dataValues.EmblemUrl);

                                            var winnerMemberPromises = [];
                                            var loserMemberPromises = [];

                                            winnerMembers.forEach(function (username) {
                                                winnerMemberPromises.push(CharacterService.getIdAndNameFromCharacterName(username));
                                            });

                                            loserMembers.forEach(function (username) {
                                                loserMemberPromises.push(CharacterService.getIdAndNameFromCharacterName(username));
                                            });

                                            Promise.all(winnerMemberPromises).then(function (characters) {
                                                characters.forEach(function (character) {
                                                    returnLog.WinnerMembers.push(character);
                                                });
                                            });

                                            Promise.all(loserMemberPromises).then(function (characters) {
                                                characters.forEach(function (character) {
                                                    returnLog.LoserMembers.push(character);
                                                });
                                            });

                                            var characterIsWinningPromise = hasCharacterWinningClan(characterId, winnerMembers).then(function (hasWinningClan) {
                                                returnLog.HasWinningClan = hasWinningClan;
                                            }).catch(reject);

                                            Promise.all([winnerMemberPromises, loserMemberPromises, characterIsWinningPromise]).then(function () {
                                                resolve(returnLog);
                                            }).catch(function (err) {
                                                reject(err);
                                            });
                                        });

                                        gameLogPromises.push(gamePromise);

                                        if (gameLogPromises.length === limit) {
                                            hasReachedLimit = true;
                                        }
                                    }
                                }
                            }

                            Promise.all(gameLogPromises).then(function (gameLogs) {
                                callback(null, gameLogs);
                            });
                        }).catch(function (err) {
                            callback(err);
                        });
                    }
                ],
                function (err, gameLogs) {
                    if (err != null && err instanceof Error) {
                        return reject(err);
                    }

                    if (gameLogs == null) {
                        return resolve([]);
                    }

                    resolve(gameLogs);
                }
            );
        }
    );
}

function getClanByCharacterId(characterId) {
    return new Promise(function (resolve, reject) {
        ClanMembersModel.findOne({
            where: {
                Cid: characterId
            },
            include: [{
                model: ClanModel, required: true, attributes: ["Name"], where: {
                    DeleteFlag: 0
                }
            }]
        }).then(function (clanMember) {
            resolve(clanMember ? clanMember.dataValues.Clan.Name : "No clan");
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getClanIdByCharacterId(characterId) {
    return new Promise(function (resolve, reject) {
        ClanMembersModel.findOne({
            where: {
                Cid: characterId
            }
        }).then(function (clanMember) {
            resolve(clanMember ? clanMember.dataValues.Clid : null);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function updateIntroduction(clanId, accountId, introduction) {
    var sanitize = require('../../services/server/HtmlSanitizeService.js');

    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (callback) {
                isAccountMasterOfClan(clanId, accountId).then(function (isOwner) {
                    callback(null, isOwner);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (isOwner, callback) {

                if (!isOwner) {
                    return callback(new Error("Character is not the owner"));
                }

                ClanModel.update({
                    Introduction: sanitize(introduction)
                }, {
                    where: {
                        ClanId: clanId
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

function saveEmblem(clanId, file, filename) {
    return new Promise(function (resolve, reject) {
        var newFileName = +clanId + '.' + FileService.getExtension(filename);
        var clientEmblemPath = "/img/clan/emblems/" + newFileName;
        var fStream = Fs.createWriteStream(__dirname + "../../../public/" + clientEmblemPath);
        file.pipe(fStream);
        fStream.on('close', function () {
            resolve(newFileName);
        });
        fStream.on('error', function (err) {
            console.log(err);
            reject(err);
        });
    });
}

function saveHeader(clanId, file, filename) {
    return new Promise(function (resolve, reject) {
        var clientHeaderPath = "/img/clan/" + clanId + "/header." + FileService.getExtension(filename);
        var fStream = Fs.createWriteStream(__dirname + "../../../public/" + clientHeaderPath);
        file.pipe(fStream);
        fStream.on('close', function () {
            resolve(clientHeaderPath);
        });
        fStream.on('error', function (err) {
            console.log(err);
            reject(err);
        });
    });
}

function createMainClanFolder() {
    return new Promise(function (resolve, reject) {
        Fs.stat(__dirname + '../../../public/img/clan', function (err) {

            if (!err) {
                return resolve();
            }

            Fs.mkdir(__dirname + '../../../public/img/clan', function (err) {
                if (err) return reject(err);
                resolve();
            });
        });
    });
}

function createClanFolder(clanId) {
    return new Promise(function (resolve, reject) {
        Fs.stat(__dirname + '../../../public/img/clan/' + clanId, function (err) {
            if (!err) return resolve();

            Fs.mkdir(__dirname + '../../../public/img/clan/' + clanId, function (err) {
                if (err) return reject(err);
                resolve();
            });
        });
    });
}

function isAccountMasterOfClan(clanId, accountId) {
    return new Promise(function (resolve, reject) {
        getById(clanId).then(function (clan) {
            if (!clan) {
                return resolve(false);
            }
            CharacterService.getCharactersFromAccountId(accountId).then(function (characters) {
                for (var i in characters) {
                    if (characters[i].dataValues.Cid === clan.MasterCid) {
                        return resolve(true);
                    }
                }
                return resolve(false);
            }).catch(reject);
        });
    });
}

function getClanEmblemUrl(filename) {
    return filename ? '/img/clan/emblems/' + filename : "/img/no-emblem (1).jpg";
}

function hasCharacterWinningClan(characterId, winnerMembers) {
    return new Promise(function (resolve, reject) {
        CharacterService.getById(characterId).then(function (character) {
            if (!character) {
                return resolve(false);
            }

            for (var i in winnerMembers) {
                if (winnerMembers[i] === character.Name) {
                    resolve(true);
                    return false;
                }
            }

            resolve(false);
        }).catch(reject);
    });
}