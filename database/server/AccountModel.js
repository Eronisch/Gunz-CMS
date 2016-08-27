var DataContent = require('./../DataContent.js');
var Sequelize = require('sequelize');
var Tedious = require('tedious');
var DateService = require('../../tools/DateService.js');

module.exports = DataContent.define('Account', {
    AID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    UserID: {
        type: Sequelize.STRING
    },
    UGradeID: {
        type: Sequelize.INTEGER
    },
    PGradeID : {
        type : Sequelize.INTEGER
    },
    Name : {
        type: Sequelize.STRING
    },
    Email : {
        type: Sequelize.STRING
    },
    RegDate : {
        type : Tedious.TYPES.DateTime,
        defaultValue: DateService.getSqlDate()
    },
    EventCoins : {
        type: Number
    },
    DonationCoins : Number,
    AvatarUrl : String,
    PasswordResetCode : String,
    PasswordResetDate : {
        fieldName : 'PasswordResetDate',
        type : Tedious.TYPES.DateTime
    },
    EndBlockDate : {
        fieldName : 'EndBlockDate',
        type : Tedious.TYPES.DateTime
    }
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'Account'
});