var DataContent = require('./../DataContent.js');
var Sequelize = require('sequelize');

module.exports = DataContent.define('DonatorShopCategory', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Name : String
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'DonatorShopCategory'
});