var DataContent = require('./../DataContent.js');

module.exports = DataContent.define('MobileChatContact', {
    Id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
    },
    ChatId: Number,
    AccountId: Number
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'MobileChatContact'
});