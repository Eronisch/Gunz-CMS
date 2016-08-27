var mobileChatService = require('../../services/server/MobileChatService.js');
var chatTypes = require('./../chatTypes.js');
var linq = require('linq');

exports.handleMessage = onMessage;
exports.onConnection = onConnection;

function onMessage(connectionSender, connections, data){
    mobileChatService.isOwner(data.chatId, connectionSender.account.accountId).then(function(isOwner){
        if(isOwner){
            linq.from(connections)
            .where(function(connection){
                return data.contacts.indexOf(connection.account.accountId) > -1;
            }).forEach(function(connection){
                console.log('group creation send');
                sendGroup(connection, data.chatId, data.ownerId, data.contacts);
            })
        }
    }).catch(function(err){
        console.log(err.stack);
    });
}

function onConnection(connection){
    mobileChatService.getGroupsIncludingAccount(connection.account.accountId).then(function(groups){
        groups.forEach(function(group){
            var contacts = group.dataValues.Contacts.map(function(account){
                return account.dataValues.AccountId;
            });

           sendGroup(connection, group.dataValues.Id, group.dataValues.Name, group.dataValues.OwnerId, contacts)
        });
    }).catch(function(err){
        console.log(err.stack);
    });
}

function sendGroup(connection, chatId, name, ownerId, contacts){
    connection.sendJson(chatTypes.group, {
        chatId : chatId,
        name : name,
        ownerId: ownerId,
        contacts : contacts
    });
}