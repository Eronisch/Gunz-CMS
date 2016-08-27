var ServerContext = require('../../database/ServerContext.js');
var ServerStatusModel = require('../../database/server/ServerStatusModel.js');
var CharacterService = require('../../services/server/CharacterService.js');
var AccountService = require('../../services/server/AccountService.js');
var ClanService = require('../../services/server/ClanService.js');
var ServerLogService = require('../../services/server/ServerLogService.js');
var Async = require('async');

exports.getStatus = getStatus;

function getStatus() {

    var characterInfo;
    var serverInfo;
    var amountClans = 0;
    var amountAccounts = 0;
    var mostOnlineUsers = 0;
    var mostOnlineUsersToday = 0;

    return new Promise(function (resolve, reject) {
        Async.parallel([
            function (callback) {
                getServerInfo().then(function (serverData) {
                    serverInfo = serverData;
                    callback();
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (callback) {
                CharacterService.getCharacterInfo().then(function (characterData) {
                    characterInfo = characterData;
                    callback();
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (callback) {
                AccountService.getAmountAccounts().then(function (amount) {
                    amountAccounts = amount;
                    callback();
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (callback) {
                ClanService.getAmountClans().then(function (amount) {
                    amountClans = amount;
                    callback();
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (callback) {
                ServerLogService.getMostOnlineUsersToday().then(function (amount) {
                    mostOnlineUsersToday = amount;
                    callback();
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (callback) {
                ServerLogService.getMostOnlineUsers().then(function (amount) {
                    mostOnlineUsers = amount;
                    callback();
                }).catch(function (err) {
                    callback(err);
                });
            }
        ], function (err) {
            if (err) {
                return reject(err);
            }

            serverInfo.amountAccounts = amountAccounts;
            serverInfo.amountClans = amountClans;
            serverInfo.amountMostOnlineUsers = mostOnlineUsers;
            serverInfo.amountMostOnlineUsersToday = mostOnlineUsersToday;

            return resolve({
                server: serverInfo,
                character: characterInfo
            });
        });
    });
}

function getServerInfo() {
    return Promise.all([getServerStatus(), getOnlineStatus()]).then(function (result) {
        return {
            currPlayer: result[0].CurrPlayer,
            maxPlayer: result[0].MaxPlayer,
            isOnline: result[1].IsOnline,
            dateChecked: result[1].DateChecked
        }
    });
}

function getOnlineStatus() {
    return ServerContext.MatchServerStatusModel.find();
}

function getServerStatus() {
    return ServerStatusModel.findOne().then(function (serverStatus) {
        return serverStatus;
    });
}
