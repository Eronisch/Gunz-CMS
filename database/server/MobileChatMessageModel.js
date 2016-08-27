var DataContent = require('./../DataContent.js');
var Tedious = require('tedious');

module.exports = DataContent.define('MobileChatMessage', {
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
    },
    AccountId : Number
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'MobileChatMessage'
});