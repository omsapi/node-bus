var message = require('./message');

var schema = new message.Schema([]);

var port = 9000;
var moment = require('moment');
var nodeList = [{
    id: moment().format('x'),
    host: 'localhost',
    port: port
}];

schema.methods.getNodeList = function (callback) {
    callback(null, nodeList);
};

schema.methods.hello = function (name, callback) {
    callback(null, 'Hello ' + name + '!');
};

module.exports = message.create(schema);
