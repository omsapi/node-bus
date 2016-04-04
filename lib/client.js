var net = require('net');
var moment = require('moment');

var Protocol = require('./node-protocol');

module.exports = function (host, port) {
    if (port) {
        var client = new net.Socket();
        var protocol = new Protocol(client);

        client.connect(port, 'localhost', function () {
            protocol.get('get-list', null, function (err, nodeList) {
                console.log(nodeList);
            });

            //++++++++++++++++++++++++++++++++++
            //protocol.set('my-method', function (msg) {
            //    return 'Hello ' + msg.name;
            //});
        });
    }
};