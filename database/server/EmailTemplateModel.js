var DataContent = require('./../DataContent.js');

var EmailTemplateModel = DataContent.define('EmailTemplate', {
    Id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
    },
    Subject: String,
    Message : String
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'EmailTemplate'
});

module.exports = EmailTemplateModel;