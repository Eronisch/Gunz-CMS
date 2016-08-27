var DataContent = require('./../DataContent.js');

module.exports = DataContent.define('MobileChat', {
    Id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
    },
    OwnerId: Number,
    Name: String,
    IsGroup: Number
}, {
    freezeTableName: true,
    timestamps: false,
    tableName: 'MobileChat'
});