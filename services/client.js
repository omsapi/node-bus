var net = require('net');
var Q = require('q');

var ClientMessage = require('../models/client-message');

module.exports = function (host, port) {
    if (!port) {
        return;
    }

    var nodeList;

    var client = new net.Socket();

    client.connect(port, 'localhost', function () {
        var message = new ClientMessage(client);

        message.getNodeList(function (err, nodes) {
            //client.end();
            console.log(nodes);
            nodeList = nodes.map(function (node) {
                var deferred = Q.defer();
                var socket = new net.Socket();

                socket.connect(node.port, node.host, function () {
                    var message = new ClientMessage(socket);
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
                message.hello('kostuyn', function (err, msg) {
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