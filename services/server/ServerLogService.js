var ServerLogModel = require('../../database/server/ServerLogModel.js');
require('../../tools/Date.js');

exports.getMostOnlineUsers = getMostOnlineUsers;
exports.getMostOnlineUsersToday = getMostOnlineUsersToday;

function getMostOnlineUsers() {
    return ServerLogModel.max('PlayerCount');
}

function getMostOnlineUsersToday() {
    return new Promise(function (resolve, reject) {
        return ServerLogModel.max('PlayerCount', {
            where: {
                Time: {
                    $gt: new Date().format('yyyy-mm-dd 00:00:00'),
                    $lt: new Date().format('yyyy-mm-dd 23:59:00')
                }
            }
        }).then(function (amount) {
            if (amount === null) {
                amount = 0;
            }
            resolve(amount);
        }).catch(function (err) {
            reject(err);
        });
    });
}