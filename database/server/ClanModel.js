var DataContent = require('./../DataContent.js');
var CharacterModel = require('../../database/server/CharacterModel.js');
var Sequelize = require('sequelize');
var Tedious = require('tedious');

var ClanModel = DataContent.define('Clan', {
    ClanId: {
		type: Sequelize.INTEGER,
		field : 'clid',
        primaryKey: true,
        autoIncrement: true
    },
    Name: {
        type: Sequelize.STRING
    },
    Wins: {
        type: Sequelize.INTEGER
    },
    Losses: {
        type: Sequelize.INTEGER
    },
    Draws: {
        type: Sequelize.INTEGER
    },
    TotalPoints : {
        type : Sequelize.INTEGER,
        field : 'totalPoint'
    },
    Point : Number,
    MasterCid : Sequelize.INTEGER, 
	RegDate : Tedious.TYPES.DateTime,
	Introduction : String,
    EmblemUrl : String,
    FaceBookUrl : String,
    GooglePlusUrl : String,
    TwitterUrl : String,
    HeaderUrl : String,
    EmblemChecksum : Number,
    DeleteFlag : Number
}, {
    freezeTableName: true,
    timestamps: false
});

ClanModel.belongsTo(CharacterModel, { foreignKey: 'MasterCid', as : 'Owner' });

module.exports = ClanModel;