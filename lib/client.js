var net = require('net');
var moment = require('moment');

var Message = require('./node-message');

module.exports = function (host, port) {
    if (port) {
        var client = new net.Socket();
        var protocol = new Message(client);

        client.connect(port, 'localhost', function () {
            protocol.request('get-list', null, function(err, nodeList){
                console.log(nodeList);
            });

            protocol.response('my-method', function (msg, callback) {                
                callback(null, 'Hello ' + msg.name);
            });
        });
    }
};