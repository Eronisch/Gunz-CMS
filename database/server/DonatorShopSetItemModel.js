var DataContent = require('./../DataContent.js');
var Sequelize = require('sequelize');

var DonatorShopSetItemModel = DataContent.define('DonatorShopSetItem', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    SetId : Number,
    SetItemId : Number
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'DonatorShopSetItem'
});

module.exports = DonatorShopSetItemModel;