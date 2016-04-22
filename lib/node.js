var Message = require('../models/message2');

function Node(socket) {
    this._message = new Message(socket);
}

Node.prototype.sendData = function (topicName, data, callback) {
    this._message.send('node-send-data', topicName, data, function (err) {
        callback(err);
    });
};