var DataContent = require('./../DataContent.js');
var CharacterModel = require('../../database/server/CharacterModel.js');
var AccountModel = require('../../database/server/AccountModel.js');
var DateService = require('../../tools/DateService.js');
var Tedious = require('tedious');

var CharacterComment = DataContent.define('CharacterComment', {
    Id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
    },
    Cid: Number,
    AccountId: Number,
    Comment : String,
    Date : {
        type : Tedious.TYPES.DateTime,
        defaultValue: DateService.getSqlDate()
    }
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'CharacterComment'
});

CharacterComment.belongsTo(CharacterModel, { foreignKey: 'Cid' });
CharacterComment.belongsTo(AccountModel, { foreignKey: 'AccountId' });

module.exports = CharacterComment;