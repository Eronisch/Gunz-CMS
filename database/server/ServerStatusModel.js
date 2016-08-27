var DataContent = require('./../DataContent.js');
var Sequelize = require('sequelize');

module.exports = DataContent.define('ServerStatus', {
    ServerId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    CurrPlayer: {
        type: Sequelize.INTEGER
    },
    MaxPlayer: {
        type: Sequelize.INTEGER
    },
    Ip: {
        type: Sequelize.STRING
    },
    Port: {
        type: Sequelize.INTEGER
    }
}, {
    freezeTableName: true,
    timestamps: false
});