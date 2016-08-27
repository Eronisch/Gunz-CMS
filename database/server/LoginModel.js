var DataContent = require('./../DataContent.js');
var Sequelize = require('sequelize');

module.exports = DataContent.define('Login', {
    UserID: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    AID: {
        type: Sequelize.INTEGER
    },
    Password : {
        type : Sequelize.STRING
    },
    EncryptedPassword : {
        type : Sequelize.STRING
    }
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'Login'
});