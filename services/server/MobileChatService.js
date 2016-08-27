var ServerContext = require('../../database/ServerContext.js');
var DateService = require('../../tools/DateService.js');
var Async = require('async');
var Sequelize = require('sequelize');
var Linq = require('linq');

exports.create = create;
exports.isOwner = isOwner;
exports.getContactsFromChat = getContactsFromChat;
exports.isAccountInGroup = isAccountInGroup;
exports.createContactChat = createContactChat;
exports.getGroupsIncludingAccount = getGroupsIncludingAccount;
exports.addChatTextMessage = addChatTextMessage;

function create(ownerId, name, isGroup, contactAccountIds) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (cb) {
                ServerContext.MobileChatModel.create({
                    OwnerId: ownerId,
                    Name: name,
                    IsGroup: isGroup
                }).then(function (result) {
                    cb(null, result.Id);
                }).catch(cb);
            },
            function (chatId, cb) {
                addMultipleContacts(chatId, contactAccountIds).then(function () {
                    cb(null, chatId);
                }).catch(cb);
            }
        ], function (err, chatId) {
            if (err) {
                return reject(err);
            }

            resolve(chatId);
        });
    })
}

function createContactChat(accountId, contactAccountId) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (cb) {
                ServerContext.MobileChatModel.find({
                    where: {
                        IsGroup: false
                    },
                    include: [{
                        required: true,
                        model: ServerContext.MobileChatContactModel,
                        attributes: [],
                        as : 'Contacts',
                        where: {
                            AccountId: {
                                $in: [accountId, contactAccountId]
                            }
                        }
                    }]
                }).then(function (chat) {
                    cb(null, chat);
                }).catch(cb);
            },
            function (chat, cb) {
                if (chat != null) {
                    return cb(null, chat.dataValues.Id);
                }

                create(accountId, null, false, [accountId, contactAccountId]).then(function (chatId) {
                    cb(null, chatId);
                }).catch(cb);
            }
        ], function (err, chatId) {
            if (err) {
                return reject(err);
            }

            resolve(chatId);
        })
    });
}

function addMultipleContacts(chatId, contactAccountIds) {
    var promises = contactAccountIds.map(function (contact) {
        return addContact(chatId, contact);
    });

    return Promise.all(promises)
}

function isOwner(chatId, accountId) {
    return ServerContext.MobileChatModel.count({
        where: {
            Id: chatId,
            OwnerId: accountId
        }
    }).then(function (amount) {
        return amount === 1;
    })
}

function getContactsFromChat(chatId) {
    return ServerContext.MobileChatContactModel.findAll({
        where: {
            ChatId: chatId
        },
        attributes: ['AccountId'],
        raw: true
    })
}

function isAccountInGroup(chatId, accountId) {
    return ServerContext.MobileChatContactModel.count({
        where: {
            ChatId: chatId,
            AccountId: accountId
        },
        raw: true
    }).then(function (amount) {
        return amount === 1;
    })
}

function addContact(chatId, accountId) {
    return ServerContext.MobileChatContactModel.create({
        ChatId: chatId,
        AccountId: accountId
    })
}

function getChat(chatId){
    return ServerContext.MobileChatModel.find({
        where : {
            Id : chatId
        },
        include: [{
            required: true,
            model: ServerContext.MobileChatContactModel,
            as : 'Contacts'
        }]
    });
}

function getGroupsIncludingAccount(accountId) {
    return ServerContext.MobileChatContactModel.findAll({
        where : {
            AccountId : accountId
        }
    }).then(function(chatContacts){
      var chatPromises = Linq.from(chatContacts)
        .select(function(contact){
            return getChat(contact.dataValues.ChatId);
        }).toArray();

        return Promise.all(chatPromises);
    });

    /*return ServerContext.MobileChatModel.findAll({
        include: [{
            required: true,
            model: ServerContext.MobileChatContactModel,
            as : 'Contact'
        }],
    });*/
}

function addMessage(chatId, accountId, isText){
    return ServerContext.MobileChatMessageModel.create({
        ChatId: chatId,
        AccountId: accountId,
        IsText : isText,
        Date : DateService.getSqlDate()
    });
}

function addChatTextMessage(chatId, accountId, textMessage){
    return addMessage(chatId, accountId, message, true).then(function(message){
        return ServerContext.MobileChatTextModel.create({
            MessageId: message.Id,
            Message: textMessage
        });
    })
}