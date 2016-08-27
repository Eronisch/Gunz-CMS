var Sequelize = require('sequelize');
var Config = require('../config.js');

module.exports = new Sequelize(Config.database.db, Config.database.user, Config.database.password, {
    host: Config.database.host,
    dialect: 'mssql',
    dialectOptions: {
        timeout: 10000
    },
    pool: {
        max: 50,
        min: 0,
        idle: 30000
    },
    logging: false
});
