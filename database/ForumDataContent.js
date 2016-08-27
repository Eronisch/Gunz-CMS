var Sequelize = require('sequelize');

module.exports = new Sequelize('gunzforum', 'Jamie', 'Halvemorgen17!', {
    host: '37.48.92.131',
    port : 3306,
    dialect: 'mysql',
    pool: {
        max: 15,
        min: 0,
        idle: 10000
    },
    logging: true
});
