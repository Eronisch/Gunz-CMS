var DataContent = require('./../DataContent.js');
var Tedious = require('tedious');

module.exports = DataContent.define('ServerLog', {
    Id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
    },
    PlayerCount: Number,
    Time : Tedious.TYPES.Date
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'ServerLog'
});