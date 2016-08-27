var DataContent = require('./../DataContent.js');
var Sequelize = require('sequelize');
var Tedious = require('tedious');
var DateService = require('../../tools/DateService.js');

module.exports = DataContent.define('PaypalPaymentOptions', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Coins: Number,
    Price: Number,
    Description : String
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'PaypalPaymentOptions'
});