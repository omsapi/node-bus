var net = require('net');
var moment = require('moment');

var ServertMessage = require('../models/server-message');

module.exports = function (host, port) {
    var nodeList = [{
        id: moment().format('x'),
        host: 'localhost',
        port: port
    }];

    var server = new net.createServer(function (socket) {
        var message = new ServertMessage(socket);

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
