var net = require('net');
var Q = require('q');

//var ClientMessage = require('../models/client-message');
var Message = require('../models/message2');

module.exports = function (host, port) {
    if (!port) {
        return;
    }


    var nodeList;

    var client = new net.Socket();

    client.connect(port, 'localhost', function () {
        //var message = new Message(client);
        //message.send('myFunc1', '1', function (err, responseMsg) {
        //    console.log('finish: ' + responseMsg);
        //});
        //
        //message.listen('remoteFunc1', function (remoteArg, callback) {
        //    console.log(remoteArg);
        //    var msg = remoteArg + 3;
        //    callback(null, msg);
        //});


        var message = new Message(client);

        message.send('getNodeList', function (err, nodes) {
            //client.end();
            console.log(nodes);
            nodeList = nodes.map(function (node) {
                var deferred = Q.defer();
                var socket = new net.Socket();

                socket.connect(node.port, node.host, function () {
                    var message = new Message(socket);
                    deferred.resolve(message);
                });

                socket.on('error', function (err) {

                });

                return {
                    id: node.id,
                    host: node.host,
                    port: node.port,
                    message: deferred.promise,
                };
            });

            nodeList[0].message.then(function (message) {
                message.send('hello', 'kostuyn', function (err, msg) {
                    console.log(msg);
                });
            });
        });

        //message.serverFunc1(1, 2, 'a', {b: 3}, function (err, data) {
        //    console.log('Client receive: ' + data);
        //    console.log(data);
        //});
    });
};