var DataContent = require('./../DataContent.js');
var Tedious = require('tedious');

var AccountMobileLoginToken = DataContent.define('AccountMobileLoginToken', {
    Id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
    },
    Aid: Number,
    Selector: String,
    Token : String,
    ExpireDate : {
        type : Tedious.TYPES.DateTime
    }
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'AccountMobileLoginToken'
});

module.exports = AccountMobileLoginToken;