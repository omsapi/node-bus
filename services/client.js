var net = require('net');

//var Message = require('./node-message');
var ClientMessage = require('../models/client-message');

module.exports = function (host, port) {
    if (port) {
        var client = new net.Socket();
        //var message = new Message(client);

        client.connect(port, 'localhost', function () {
            var message = ClientMessage(client);

            message.serverFunc1(1, 2, 'a', {b: 3}, function (err, data) {
                console.log('Client receive: ' + data);
                console.log(data);
            });

            //message.request('get-list', null, function(err, nodeList){
            //    console.log(nodeList);
            //});
            //
            //message.response('my-method', function (msg, callback) {
            //    callback(null, 'Hello ' + msg.name);
            //});
        });
    }
};