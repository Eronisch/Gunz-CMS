var DataContent = require('./../DataContent.js');
var Sequelize = require('sequelize');
var Tedious = require('tedious');
var DateService = require('../../tools/DateService.js');
var ClanModel = require('../../database/server/ClanModel.js');
var AccountModel = require('../../database/server/AccountModel.js');

var ClanCommentModel = DataContent.define('ClanComment', {
    Id: {
		type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ClanId: {
        type: Sequelize.INTEGER
    },
    AccountId: {
        type: Sequelize.INTEGER
    },
    Comment: {
        type: String
    },
    Date : {
        type : Tedious.TYPES.DateTime,
        defaultValue: DateService.getSqlDate()
    }
}, {
    freezeTableName: true,
    timestamps: false
});

ClanCommentModel.belongsTo(ClanModel, { foreignKey: 'ClanId' });
ClanCommentModel.belongsTo(AccountModel, { foreignKey: 'AccountId' });

module.exports = ClanCommentModel;
