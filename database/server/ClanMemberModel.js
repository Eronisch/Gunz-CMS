var DataContent = require('./../DataContent.js');
var Sequelize = require('sequelize');
var Tedious = require('tedious');
var ClanModel = require('../../database/server/ClanModel.js');
var CharacterModel = require('../../database/server/CharacterModel.js');

var ClanMemberModel = DataContent.define('ClanMember', {
    Cmid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field : 'cmid'
    },
    Cid: {
        type: Sequelize.INTEGER
    },
    Clid: {
        type: Sequelize.INTEGER
    },
    Grade : Sequelize.INTEGER
}, {
    freezeTableName: true,
    timestamps: false
});

ClanMemberModel.belongsTo(ClanModel, { foreignKey: 'clid' });
ClanMemberModel.belongsTo(CharacterModel, { foreignKey: 'cid' });

module.exports = ClanMemberModel;