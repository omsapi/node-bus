var Message = require('./message');

module.exports = function (socket) {
    var message = new Message([
        'clientFunc1'
    ]);

    message.methods.serverFunc1 = function (arg1, arg2, arg3, arg4, callback) {
        console.log('Server: ' + arg1);
        console.log('Server: ' + arg2);
        console.log('Server: ' + arg3);
        console.log('Server: ' + arg4);

        callback(null, 'hello from Server!');
    };

    message.create(socket);

    return message;
};
