var DataContent = require('./../DataContent.js');
var Sequelize = require('sequelize');
var Tedious = require('tedious');

module.exports = DataContent.define('MatchServerStatus', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    IsOnline: {
        type: Sequelize.INTEGER
    },
    DateChecked: {
        type : Tedious.TYPES.DateTime
    }
}, {
    freezeTableName: true,
    timestamps: false
});