var express = require('express');
var http = require('http');
var chatWebSocket = require('./websocket/chat.js');
var BundleUp = require('bundle-up2');
var assets = require('./assets.js');
var cluster = require('cluster');
var routes = require('./routes/routes.js');
var chalk = require('chalk');
var path = require('path');
var os = require('os');
var ejs = require('ejs');
var async = require('async');

if (cluster.isMaster) {
    startWorkers();
}
else {
    initProcess(process, cluster.worker.id);
}

function setBundle(app, isDevelopment) {
    return new Promise(function(resolve){
        try{
            BundleUp(app, assets, {
                staticRoot: __dirname + '/public/',
                staticUrlRoot: '/',
                bundle: !isDevelopment,
                minifyCss: !isDevelopment,
                minifyJs: !isDevelopment,
                complete: resolve
            });
        }
        catch(ex){
            console.log(ex);
        }
    })
}

function startWorkers(){
    var workers = async.queue(function (task, cb) {
        task().then(cb);
    }, 1);

    for(var i = 0; 1 > i; i++){
        workers.push(forkProcess);
    }
}

function forkProcess() {
    return new Promise(function (resolve) {
        cluster.fork().on('message', function () {
            resolve();
        });
    })
}

function initProcess(process, worker) {
    var app = express();
    var httpServer = http.createServer(app);

    return setBundle(app, true).then(function(){
        routes.init(app, worker);

        app.set('port', process.env.PORT || 80);
        app.set('views', path.join(__dirname, 'views'));
        app.engine('html', ejs.renderFile);

        httpServer.listen(app.get('port'));

        console.log(chalk.green('Web worker: ' + worker + ' started...'));

        chatWebSocket.createServer(httpServer);

        process.send(null);
    });


}