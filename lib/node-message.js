var shortid = require('shortid');

var Protocol = require('./socket-protocol');

function NodeMessage(socket) {
    var self = this;
    self.requestCallbacks = {};
    self.protocol = new Protocol(socket);

    this.protocol.on(Protocol.RESPONSE, function (msg) {
        var callback = self.requestCallbacks[msg.id];

        callback(msg.err, msg.data);
    });
}

NodeMessage.prototype.request = function (method, data, callback) {
    var id = shortid.generate();
    var msg = {
        id: id,
        data: data
    };

    this.requestCallbacks[id] = callback;

    this.protocol.send(Protocol.REQUEST, method, msg);
};

NodeMessage.prototype.response = function (method, callback) {
    var self = this;
    self.protocol.on(method, function (msg) {
        callback(msg.data, function (err, data) {
            var respMsg = {
                id: msg.id,
                data: data,
                err: err
            };

            self.protocol.send(Protocol.RESPONSE, method, respMsg);
        });
    });
};

module.exports = NodeMessage;