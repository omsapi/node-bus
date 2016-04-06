var shortid = require('shortid');
var Protocol = require('../lib/socket-protocol');

function Message(remoutes) {
    this.remoutes = remoutes;
    this.methods = {};
    this.callbacks = {};

}

Message.prototype.create = function (socket) {
    var protocol = new Protocol(socket);
    var self = this;
    //-----------
    self.remoutes.forEach(function (funcName) {
        self[funcName] = function () {
            var pos = arguments.length - 1;
            var args = [].slice.call(arguments, 0, pos);
            var callback = arguments[pos];
            var id = shortid.generate();

            var msg = {
                id: id,
                data: args
            };

            self.callbacks[id] = callback;

            protocol.on(Protocol.RESPONSE, function (msg) {
                var func = self.callbacks[msg.id];
                func(msg.err, msg.data);
                //delete self.callbacks[msg.id];
            });

            protocol.send(Protocol.REQUEST, funcName, msg);
        };
    });
    //-----------

    for (var methodName in self.methods) {
        var method = self.methods[methodName];
        protocol.on(methodName, function (msg) {
            var args = [].concat.call(msg.data, callback);
            function callback(err, data) {
                var respMsg = {
                    id: msg.id,
                    data: data,
                    err: err
                };

                protocol.send(Protocol.RESPONSE, methodName, respMsg);
            }

            method.apply(this, args);


        })
    }

    //-----------
};

module.exports = Message;
