var DataContent = require('./../DataContent.js');
var Sequelize = require('sequelize');
var Tedious = require('tedious');

var DonatorShopItemModel = DataContent.define('DonatorShopItem', {
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
    CategoryId : Number,
    ItemId : Number,
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
    ThirtyDayPrice : Number,
    SixtyDayPrice : Number,
    UnlimitedPrice : Number,
    NewThirtyDayPrice : Number,
    NewSixtyDayPrice : Number,
    NewUnlimitedPrice : Number
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'DonatorShopItem'
});

module.exports = DonatorShopItemModel;