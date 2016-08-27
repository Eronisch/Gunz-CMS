var DataContent = require('./../DataContent.js');
var Sequelize = require('sequelize');
var Tedious = require('tedious');
var AccountModel = require('../../database/server/AccountModel.js');

var CharacterModel = DataContent.define('Character', {
    Cid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Aid: Number,
    Name: {
        type: Sequelize.STRING
    },
    PlayTime: {
        type: Sequelize.INTEGER
    },
    KillCount: {
        type: Sequelize.INTEGER
    },
    DeathCount: {
        type: Sequelize.INTEGER
    },
    Level: {
        type: Sequelize.INTEGER
    },
    Xp: {
        type: Sequelize.INTEGER
    },
    RegDate: Tedious.TYPES.DateTime,
    LastOnline: Tedious.TYPES.DateTime,
    About: String,
    HeaderUrl: String,
    Sex: Number,
    AvatarUrl: String,
    DeleteFlag: Number,
    nRedColor : Number,
    nGreenColor : Number,
    nBlueColor : Number
}, {
    freezeTableName: true,
    timestamps: false
});

CharacterModel.belongsTo(AccountModel, {foreignKey: 'Aid'});

module.exports = CharacterModel;