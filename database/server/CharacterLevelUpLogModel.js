var DataContent = require('./../DataContent.js');
var Tedious = require('tedious');

module.exports = DataContent.define('LevelUpLog', {
    Id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
    },
    Cid: Number,
    Level: Number,
    Date : {
        field : 'Date',
        type : Tedious.TYPES.DateTime
    }
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'LevelUpLog'
});