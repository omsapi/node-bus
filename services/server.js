var net = require('net');
var moment = require('moment');

//var ServertMessage = require('../models/server-message');
var Message = require('../models/message2');

module.exports = function (host, port) {
    var nodeList = [{
        id: moment().format('x'),
        host: 'localhost',
        port: port
    }];

    var server = new net.createServer(function (socket) {
        var message = new Message(socket);
        message.listen('myFunc1', function (remoteArg, callback) {
            console.log(remoteArg);
            var msg = remoteArg + 2;

            message.send('remoteFunc1', msg, function (err, remoteResponse) {
                console.log(remoteResponse);
                var msg = remoteResponse + 4;
                //callback(null, 'OK');
                message.send('remoteFunc1', msg, function (err, remoteResponse) {
                    console.log(remoteResponse);
                    var msg = remoteResponse + 5;
                    callback(null, msg);
                });
            });
        });

        //var message = new ServertMessage(socket);

        //message.clientFunc1(1, 2, 'a', {b: 3}, function (err, data, arg2) {
        //    console.log('Server receive: ' + data);
        //    console.log(data);
        //    console.log('Arg2: ' + arg2);
        //});
    });

    server.listen(port, 'localhost', function () {
        console.log('Server is started on port: ' + port);
    });
};
