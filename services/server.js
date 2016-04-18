var net = require('net');
var moment = require('moment');
var Q = require('q');

//var ServertMessage = require('../models/server-message');
var Message = require('../models/message2');
var Topic = require('../lib/topic');

module.exports = function (host, port) {
    var nodeList = [{
        id: moment().format('x'),
        host: 'localhost',
        port: port
    }];

    var topics = {};
    var clients = {};

    var server = new net.createServer(function (socket) {
        //var message = new Message(socket);
        //message.listen('myFunc1', function (remoteArg, callback) {
        //    console.log(remoteArg);
        //    var msg = remoteArg + 2;
        //
        //    message.send('remoteFunc1', msg, function (err, remoteResponse) {
        //        console.log(remoteResponse);
        //        var msg = remoteResponse + 4;
        //        //callback(null, 'OK');
        //        message.send('remoteFunc1', msg, function (err, remoteResponse) {
        //            console.log(remoteResponse);
        //            var msg = remoteResponse + 5;
        //            callback(null, msg);
        //        });
        //    });
        //});

        var message = new Message(socket);
        message.listen('getNodeList', function (callback) {
            callback(null, nodeList);
        });

        message.listen('hello', function (name, callback) {
            callback(null, 'Hello ' + name + '!');
        });

        message.listen('send-data', function (topicName, data, callback) {
            console.log('Received: ' + topicName);
            console.log(data);

            var topic = topics[topicName] = topics[topicName] || new Topic();
            var message = {
                data: data,
                created: moment.utc(),
                lastUpdate: moment.utc()
            };

            topic.add(message);

            callback(null);
        });

        message.listen('create-channel', function (clientId, topicName, channelName, callback) {
            console.log('Create channel. Received clientID: ' + clientId);

            var client = clients[clientId] = clients[clientId] || {};
            client.topicName = topicName;
            client.channelName = channelName;

            callback();
        });

        message.listen('get-message', function (clientId, topicName, channelName, callback) {
            console.log('Get message. Received clientID: ' + clientId);

            var client = clients[clientId];
            var topic = topics[topicName];

            console.log(topic._messages.length);
            console.log(topic._deferreds.length);
            console.log('+++++++++++++++++++++++++++');
            topic.next(clientId, function (err, msg) {
                console.log(topic._messages.length);
                console.log(topic._deferreds.length);
                callback(null, msg);
            });
        });

        message.listen('ack', function (clientId) {
            console.log('Received ack: ' + clientId);
            var client = clients[clientId];
            var topicName = client.topicName;
            var topic = topics[topicName];

            console.log(topics);
            console.log(topic);
            var msg = topic.pop();
            console.log(msg);
            client.callback(null, msg);
        });

        message.listen('create-c')
    });

    server.listen(port, 'localhost', function () {
        console.log('Server is started on port: ' + port);
    });
};
