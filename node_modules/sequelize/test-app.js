/*jshint quotmark: false */
"use strict";
var Sequelize = require('./index');
var DataTypes = Sequelize;
var inflection = require('inflection');
var cls = require('continuation-local-storage');
var ns = cls.createNamespace('sequelize');
var _ = require('lodash');
//Sequelize.cls = ns;
var Promise = Sequelize.Promise;
var db, sequelize;
Promise.longStackTraces();



 //db = sequelize = new Sequelize('sequelize-test-43', 'sequelize', 'nEGkLma26gXVHFUAHJxcmsrK', {
 //    dialect: 'mssql',
 //    host: 'mssql.sequelizejs.com',
 //    port: 11433,
//db = sequelize = new Sequelize('sequelize_test', 'postgres', 'postgres', {
//    dialect: 'postgres',
 db = sequelize = new Sequelize('sequelize_test', 'root', null, {
     dialect: 'sqlite'  ,
     //dialect: 'mariadb',
    // omitNull: true,
    // timezone: '+02:00',
    // host: '127.0.0.1',
  // "timezone": "Europe/London",

  dialectOptions: {
        requestTimeout: 20000000
    },
    define: {
        paranoid: false,
        // freezeTableName:true,
        //underscoredAll: true,
        // underscored: true
        timestamps: false
    },
    pool: {
        max: 100
    },
    validation: true
});

var User = sequelize.define('user');


sequelize.sync({
   logging: console.log,
  force: true
}).bind({}).then(function() {
  return User.create()
}).then(function(rows) {
  return User
    .findOne(
    {
      where :
      {
        id : 1
      },
      include: [{ all: true,nested:true}]
    }
  )

}).then(function(user) {
  console.log(user)
  console.log(user.options)
}).then(function(row) {

 //}).catch(function(err) {
 //    console.log(err)
}).finally(function() {
    return sequelize.close();
}).done();
