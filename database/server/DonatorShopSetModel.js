var DataContent = require('./../DataContent.js');
var Sequelize = require('sequelize');

var DonatorShopSetModel = DataContent.define('DonatorShopSet', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    DonatorShopItemId : Number
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'DonatorShopSet'
});

module.exports = DonatorShopSetModel;