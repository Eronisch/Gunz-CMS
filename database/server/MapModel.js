var DataContent = require('./../DataContent.js');
var Sequelize = require('sequelize');
module.exports = DataContent.define('Map', {
    MapId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Name: {
        type: Sequelize.STRING
    },
    MaxPlayer: {
        type: Sequelize.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'Map'
});