var DataContent = require('./../DataContent.js');
var CharacterModel = require('../../database/server/CharacterModel.js');

var CharacterSkillModel = DataContent.define('CharacterSkill', {
    Id: {
        type: Number,
        primaryKey: true,
        autoIncrement: true
    },
    Cid: Number,
    Skill: String
}, {
    freezeTableName: true,
    timestamps: false,
    tableName : 'CharacterSkill'
});

CharacterSkillModel.belongsTo(CharacterModel, { foreignKey: 'Cid' });

module.exports = CharacterSkillModel;