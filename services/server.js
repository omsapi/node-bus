var net = require('net');
var moment = require('moment');

//var Message = require('./node-message');
var ServertMessage = require('../models/server-message');

module.exports = function (host, port) {
    var nodeList = [{
        id: moment().format('x'),
        host: 'localhost',
        port: port
    }];

    var server = new net.createServer(function (socket) {
        var message = ServertMessage(socket);

        message.clientFunc1(1, 2, 'a', {b: 3}, function (err, data) {
            console.log('Server receive: ' + data);
            console.log(data);
        });

        //var message = new Message(socket);
        //message.response('get-list', function(msg, callback){
        //    callback(null, nodeList);
        //});
        //
        //message.request('my-method', {name: 'kostuyn'}, function (err, msg) {
        //    console.log('Server get: ' + msg);
        //});
    });


    server.listen(port, 'localhost', function () {
        console.log('Server is started on port: ' + port);
    });
};
