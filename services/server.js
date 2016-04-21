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

        message.listen('getNodeList', function (res) {
            res.send(null, nodeList);
        });

        message.listen('hello', function (name, res) {
            res.send(null, 'Hello ' + name + '!');
        });

        //#######################################

        message.listen('send-data', function (topicName, data, res) {
            console.log('Received: ' + topicName);
            console.log(data);

            topicService.add(topicName, data);

            res.send(null);
        });

        message.listen('create-channel', function (clientId, topicName, channelName, res) {
            console.log('Create channel. Received clientID: ' + clientId);

            res.send();
        });

        message.listen('get-message', function (clientId, topicName, channelName, res) {
            console.log('Get message. Received clientID: ' + clientId);
            curClientId = clientId;


            var remote = new Remote(topicName, channelName, res);

            topicService.addRemote(remote);
        });

        message.listen('finish-message', function (clientId, topicName, channelName, msgId, res) {
            //console.log('Finish message: ' + msgId);
            //res.send(null);

            topicService.finishMsg(topicName, msgId, function(err){
                console.log('Send FINISH ' +msgId);
                res.send(err, 'Hello! ' +msgId);
            });
        });
    });

    server.listen(port, 'localhost', function () {
        console.log('Server is started on port: ' + port);
    });
};
