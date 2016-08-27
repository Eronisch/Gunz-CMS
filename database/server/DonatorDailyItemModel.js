var DataContent = require('./../DataContent.js');
var Sequelize = require('sequelize');
var Tedious = require('tedious');

module.exports = DataContent.define('DonatorDailyItem', {
    Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Date : {
        type : Tedious.TYPES.DateTime,
        field : 'Date'
    },
    Image : String,
    ItemId : Number,
    ThirtyDayPrice : Number,
    SixtyDayPrice : Number,
    UnlimitedPrice : Number,
    Quantity : Number,
    Damage : Number,
    Delay : Number,
    Magazine : Number,
    MaxBullet : Number,
    MaxWeight : Number,
    ReloadTime : Number,
    Hp : Number,
    Ap : Number,
    Sex : Number,
    Weight : Number,
    Name : String,
    Description : String,
    LimitAmount : Number,
    PurchasedAmount : Number

}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'DonatorDailyItem'
});