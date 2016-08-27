var DataContent = require('./../DataContent.js');
var Sequelize = require('sequelize');
var Tedious = require('tedious');
var DateService = require('../../tools/DateService.js');

module.exports = DataContent.define('PaySafeCard', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    AccountId: Number,
    Code : String,
    PaymentOptionId : Number,
    Date : {
        type : Tedious.TYPES.DateTime
    },
    DateCompleted : {
        type : Tedious.TYPES.DateTime
    }
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'PaySafeCard'
});