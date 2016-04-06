var message = require('./message');

var schema = new message.Schema([
    'getNodeList',
    'hello'
]);

//schema.methods.clientFunc1 = function (arg1, arg2, arg3, arg4, callback) {
//    console.log('Client: ' + arg1);
//    console.log('Client: ' + arg2);
//    console.log('Client: ' + arg3);
//    console.log('Client: ' + arg4);
//
//    callback(null, 'hello from Client!', 'two argument');
//};

module.exports = message.create(schema);
