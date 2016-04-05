var net = require('net');
var moment = require('moment');

var Message = require('./node-message');

module.exports = function (host, port) {
    var nodeList = [{
        id: moment().format('x'),
        host: 'localhost',
        port: port
    }];

    var server = new net.createServer(function (socket) {
        var protocol = new Message(socket);
        protocol.response('get-list', function(msg, callback){
            callback(null, nodeList);
        });

        protocol.request('my-method', {name: 'kostuyn'}, function (err, msg) {
            console.log('Server get: ' + msg);
        });
    });


    server.listen(port, 'localhost', function () {
        console.log('Server is started on port: ' + port);
    });
};
