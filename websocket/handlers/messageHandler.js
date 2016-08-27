var mobileChatService = require('../../services/server/MobileChatService.js');
var chatTypes = require('./../chatTypes.js');
var linq = require('linq');
var async = require('async');
exports.handleMessage = onMessage;

function onMessage(connectionSender, connections, data) {
    async.waterfall([
        function (cb) {
            mobileChatService.isAccountInGroup(data.chatId, connectionSender.account.accountId).then(function (isInGroup) {
                if (!isInGroup) {
                    return cb(new Error("Account is not in group."))
                }

                cb();
            }).catch(cb);
        },
        function (cb) {
            mobileChatService.getContactsFromChat(data.chatId).then(function(contacts){
                cb(null, contacts);
            }).catch(cb);
        },
        function (cb){
            mobileChatService.addChatTextMessage(data.chatId, connectionSender.account.accountId, data.message).then(function(){
                cb();
            }).catch(cb);
        },
        function(contacts, cb){
            linq.from(connections).where(function(connection){
                return linq.from(contacts).any(function(contact){
                    return contact.AccountId === connection.account.accountId && contact.AccountId !== connectionSender.account.accountId;
                })
            }).forEach(function(connection){
                console.log('message send');
                data.accountId = connectionSender.account.accountId;
                connection.sendJson(chatTypes.message, data);
            });

            cb();
        }
    ], function(err){
        if(err){
            console.log(err.stack);
        }
    })
}
