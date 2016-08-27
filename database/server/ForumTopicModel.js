var DataContent = require('./../DataContent.js');

module.exports = DataContent.define('ForumTopic', {
    Id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
    },
    Name: Number,
    Username: Number,
    Timestamp : Number,
    AvatarUrl : String,
    Post : String,
    ForumId : Number
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'ForumTopic'
});