var DataContent = require('./../DataContent.js');
var Sequelize = require('sequelize');

module.exports = DataContent.define('Item', {
    ItemId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Name : String,
    Description : String,
    ResSex : Number,
    Weight : Number,
    Damage : Number,
    Delay : Number,
    Magazine : Number,
    MaxBullet : Number,
    Hp : Number,
    Ap : Number,
    ReloadTime : Number,
    Slot : Number,
    MaxWeight : {
        type : Number,
        field : 'MaxWt'
    }
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'Item'
});