var DataContent = require('./../DataContent.js');

var AccountItem = DataContent.define('ItemRotation', {
    Id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
    },
    ItemId: Number,
    Year: Number,
    Month: Number
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'ItemRotation'
});

module.exports = AccountItem;