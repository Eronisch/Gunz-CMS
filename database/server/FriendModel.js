var DataContent = require('./../DataContent.js');
var CharacterModel = require('../../database/server/CharacterModel.js');

var FriendModel = DataContent.define('Friend', {
    Id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
    },
    Cid: Number,
    FriendCid: Number,
    Type : Number,
    Favorite : Number,
    DeleteFlag : Number
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'Friend'
});

FriendModel.belongsTo(CharacterModel, { foreignKey: 'Cid' });
FriendModel.belongsTo(CharacterModel, { foreignKey: 'FriendCid', as : 'FriendCharacter' });

module.exports = FriendModel;