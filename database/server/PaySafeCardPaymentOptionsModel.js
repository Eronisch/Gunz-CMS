var DataContent = require('./../DataContent.js');
var Sequelize = require('sequelize');
var DateService = require('../../tools/DateService.js');

module.exports = DataContent.define('PaySafeCardPaymentOptions', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Coins: Number,
    Price: Number
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'PaySafeCardPaymentOptions'
});