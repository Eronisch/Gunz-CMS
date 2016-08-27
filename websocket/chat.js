var ws = require('ws');
var urlHelper = require('../tools/UrlHelper.js');
var mobileLoginService = require('../services/server/MobileLoginService.js');
var chalk = require('chalk');
var linq = require('linq');
var groupHandler = require('./handlers/groupHandler.js');
var groupAvatarHandler = require('./handlers/groupAvatarHandler.js');
var messageHandler = require('./handlers/messageHandler.js');

function startServer(httpServer) {

    var PATH = '/mobile/chat';

    var webSocketServer = new ws.Server({
        path: PATH,
        server: httpServer,
        verifyClient: verifyClient
    });

    webSocketServer.on('connection', function (ws) {
        console.log('User joined the chat.');

        var urlQueryArray = urlHelper.getQueryArray(ws.upgradeReq.url);

        ws.account = {
            accountId: parseInt(urlQueryArray[0]),
            selector: urlQueryArray[1],
            token: urlQueryArray[2]
        };

        ws.sendJson = sendJson;

        groupHandler.onConnection(ws);

        ws.on('message', function (requestData) {
            console.log('Chat message received from: ' + ws.account.accountId);

            var objectData = JSON.parse(requestData);

            switch (objectData.type) {
                case 'group' :
                {
                    groupHandler.handleMessage(ws, webSocketServer.clients, objectData.data);
                    break;
                }
                case 'groupAvatar' :
                {
                    groupAvatarHandler.handleMessage(ws, webSocketServer.clients, objectData.data);
                    break;
                }
                case 'message' :
                {
                    messageHandler.handleMessage(ws, webSocketServer.clients, objectData.data);
                    break;
                }
                default :
                {
                    console.log('Chat incoming message not handled: ' + objectData.type);
                }
            }
        });

        ws.on('close', function () {
            // todo: send offline status to everyone
            console.log('User left the chat.');
        });
    });

    webSocketServer.on('message', function (data) {
        console.log('message received: ' + data)
    });

    webSocketServer.on('error', function (err) {
        console.log(err)
    });

    function verifyClient(info, callback) {
        var urlQueryArray = urlHelper.getQueryArray(info.req.url);

        mobileLoginService.verifyLogin(urlQueryArray[0], urlQueryArray[1], urlQueryArray[2]).then(function (isValid) {
            callback(isValid);
        }).catch(function (err) {
            console.log(err);
            callback(false);
        })
    }

    function sendJson(type, data) {
        var sendObject = {
            type: type,
            data: data
        };
        this.send(JSON.stringify(sendObject));
    }
}

exports.createServer = function (httpServer) {
    startServer(httpServer);
};