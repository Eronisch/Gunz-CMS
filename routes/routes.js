var json = require('express-json');
var bodyParser = require('body-parser');
var session = require('express-session');
var busboy = require('connect-busboy');
var cors = require('cors');
var favicon = require('serve-favicon');
var stylus = require('stylus');
var chalk = require('chalk');
var path = require('path');
var redis = require('redis');
var express = require('express');
var fs = require('fs');
var RedisStore = require('connect-redis')(session);

var apiAdminRouter = require('./api-admin-router.js');
var apiRouter =  require('./api-router.js');
var apiMobileRouter =  require('./api-mobile-router.js');
var webRouter = require('./web/index.js');
var payPalRouter = require('./paypal-router.js');

exports.init = init;

function init (app, workerId) {
    var redisClient = redis.createClient();

    redisClient.on('error', function (err) {
        console.log('Redis error: ' + err);
    });

    /*  Third party middleware */
    app.use(favicon(__dirname + '/../public/img/favicon.png'));
    app.use(json());
    app.use(busboy());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(stylus.middleware(path.join(__dirname, '/../public')));
    app.use(express.static(path.join(__dirname, '/../public'), {maxAge: 604800000})); // 7 days
    app.use(cors());
    app.use(session({
        store: new RedisStore({
            host: 'localhost',
            port: 6379,
            client: redisClient,
            ttl: 7200
        }),
        secret: 'ThSeScGw35xcmxr46fDF',
        saveUninitialized: true,
        resave: false
    }));

    app.use('/', function (req, res, next) {
        console.log(chalk.yellow('Incoming request: ' + req.originalUrl + ', from: ' + (req.headers['x-forwarded-for'] || req.connection.remoteAddress) + ', worker: ' + workerId));
        next();
    });

    app.use(apiRouter);
    app.use(payPalRouter);
    app.use(apiAdminRouter);
    app.use(apiMobileRouter);

    app.get('/*', webRouter.index);

    app.use(function (err, req, res, next) {
        logError(err, req);
        next();
    });
}

function logError(err, req){
   // console.log(chalk.red(err));
    console.log(err.stack);

    var errorWriteStream = fs.createWriteStream('error.log', {'flags': 'a'});

    errorWriteStream.on('open', function(){
        errorWriteStream.write('Date: ' + Date());
        errorWriteStream.write('\n');
        errorWriteStream.write('URL: ' + req.protocol + '://' + req.get('host') + req.originalUrl);
        errorWriteStream.write('\n');
        errorWriteStream.write('Stack: ' + err.stack);
        errorWriteStream.write('\n');
        errorWriteStream.write('-----------------------------------------------------------------------------------------------------------------------------------------------------------');
        errorWriteStream.write('\n');
        errorWriteStream.end();
    });

}