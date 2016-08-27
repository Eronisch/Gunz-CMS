var DataContent = require('./../DataContent.js');

module.exports = DataContent.define('PlayerLog', {
    Id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
    },
    PlayTime: Number,
    Kills: Number,
    Deaths : Number,
    TotalXp : Number
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'PlayerLog'
});