var net = require('net');
var moment = require('moment');

var Protocol = require('./node-protocol');

module.exports = function (host, port) {
    var nodeList = [{
        id: moment().format('x'),
        host: 'localhost',
        port: port
    }];

    var server = new net.createServer(function (socket) {
        var protocol = new Protocol(socket);
        protocol.set('get-list', function () {
            return nodeList;
        });

        //++++++++++++++++++++++++++++++++++
        //protocol.get('my-method', {name: 'kostuyn'}, function (msg) {
        //    console.log('Server get: ' + msg);
        //})
    });


    server.listen(port, 'localhost', function () {
        console.log('Server is started on port: ' + port);
    });
};
