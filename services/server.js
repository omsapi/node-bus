var net = require('net');
var moment = require('moment');

var Message = require('../models/message2');
var Remote = require('../lib/remote');
var TopicService = require('../lib/topic-service');


module.exports = function (host, port) {
    var nodeList = [{
        id: moment().format('x'),
        host: 'localhost',
        port: port
    }];

    var topicService = new TopicService();

    var server = new net.createServer(function (socket) {
        var curClientId;
        var message = new Message(socket);

        //#######################################

        message.listen('getNodeList', function (callback) {
            callback(null, nodeList);
        });

        message.listen('hello', function (name, callback) {
            callback(null, 'Hello ' + name + '!');
        });

        //#######################################

        message.listen('send-data', function (topicName, data, callback) {
            console.log('Received: ' + topicName);
            console.log(data);

            topicService.add(topicName, data);

            callback(null);
        });

        message.listen('create-channel', function (clientId, topicName, channelName, callback) {
            console.log('Create channel. Received clientID: ' + clientId);

            callback();
        });

        message.listen('get-message', function (clientId, topicName, channelName, callback) {
            console.log('Get message. Received clientID: ' + clientId);
            curClientId=clientId;

            var remote = new Remote(topicName, channelName, callback);
            message.setErrorHandler(remote.sendError.bind(remote));

            topicService.addRemote(remote);
            //callback({data: 'hello'});

            //message.on('error', function (err) {
            //    console.log('!!!!ERROR!!!! '+curClientId);
            //    console.log(err);
            //    console.log('!!!!ERROR!!!! '+curClientId);
            //    remote.sendError(err);
            //});
        });
    });

    server.listen(port, 'localhost', function () {
        console.log('Server is started on port: ' + port);
    });
};
