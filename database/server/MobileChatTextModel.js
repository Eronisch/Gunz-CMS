var DataContent = require('./../DataContent.js');
var Tedious = require('tedious');

var AccountItem = DataContent.define('MobileChatText', {
    Id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
    },
    ChatId: Number,
    IsText: Boolean,
    Date : {
        type : Tedious.TYPES.DateTime,
        field : 'Date'
    }
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'MobileChatText'
});

module.exports = AccountItem;