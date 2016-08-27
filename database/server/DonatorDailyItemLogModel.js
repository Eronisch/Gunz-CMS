var DataContent = require('./../DataContent.js');
var Tedious = require('tedious');

module.exports = DataContent.define('DonatorDailyItemLog', {
    Id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
    },
    AccountId: Number,
    DailyItemId: Number,
    Date : {
        type : Tedious.TYPES.DateTime,
        field : 'Date'
    }
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'DonatorDailyItemLog'
});