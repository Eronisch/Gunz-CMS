var mobileChatService = require('../../services/server/MobileChatService.js');
var chatTypes = require('./../chatTypes.js');
var linq = require('linq');

exports.handleMessage = onMessage;

function onMessage(connectionSender, connections, data){
    mobileChatService.isOwner(data.chatId, connectionSender.account.accountId, data.accountId).then(function(isOwner) {
        if (!isOwner) {
            return new Error('Can\'t set an avatar if you are not the group owner');
        }
    }).then(function(){
        return mobileChatService.getContactsFromChat(data.chatId)
    }).then(function(contacts){
        linq.from(connections)
            .where(function(connection){
                return linq.from(contacts).any(function(contact){
                    return contact.AccountId === connection.account.accountId && contact.AccountId !== connectionSender.account.accountId;
                })
            }).forEach(function(connection){
            console.log('group avatar send');
            connection.sendJson(chatTypes.groupAvatar, data);
        })
    }).catch(function(err){
        console.log(err.stack);
    })
}