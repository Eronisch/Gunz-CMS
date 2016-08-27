var DataContent = require('./../DataContent.js');
var Sequelize = require('sequelize');
var Tedious = require('tedious');
var DateService = require('../../tools/DateService.js');

var PayPalModel = DataContent.define('Paypal', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    PaymentId: String,
    PayerId : String,
    Token : String,
    AccountId: Number,
    InvoiceId : String,
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
    tableName : 'Paypal'
});

module.exports = PayPalModel;