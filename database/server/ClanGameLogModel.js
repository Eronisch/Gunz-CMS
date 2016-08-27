var DataContent = require('./../DataContent.js');
var Tedious = require('tedious');
var ClanModel = require('../../database/server/ClanModel.js');
var MapModel = require('../../database/server/MapModel.js');

var ClanGameLog = DataContent.define('ClanGameLog', {
    id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true,
        field : 'id'
    },
    WinnerClanId : {
        type : Number,
        field : 'winnerClid',
    },
    LoserClanId : {
        type : Number,
        field : 'loserClid',
    },
    WinnerClanName: {
        type: String,
    },
    LoserClanName: {
        type: String
    },
    RoundWins : Number,
    RoundLosses : Number,
    RegDate : Tedious.TYPES.DateTime,
    WinnerMembers : String,
    LoserMembers : String,
    MapId : Number
}, {
    freezeTableName: true,
    timestamps: false
});

ClanGameLog.belongsTo(ClanModel, { foreignKey: 'WinnerClanId', as : 'WinnerClan' });
ClanGameLog.belongsTo(ClanModel, { foreignKey: 'LoserClanId', as : 'LoserClan' });
ClanGameLog.belongsTo(MapModel, { foreignKey: 'MapId' });

module.exports = ClanGameLog;