var DataContent = require('./../DataContent.js');
var Tedious = require('tedious');

var AccountItem = DataContent.define('AccountItem', {
    Aiid: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
    },
    Aid: Number,
    ItemId: Number,
    RentDate : {
        type : Tedious.TYPES.DateTime,
        field : 'RentDate'
    },
    RentHourPeriod : Number,
    Cnt : Number
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'AccountItem'
});

module.exports = AccountItem;