var Message = require('./message');

module.exports = function(socket){
    var message = new Message([
        'serverFunc1'
    ]);

    message.methods.clientFunc1 = function (arg1, arg2, arg3, arg4, callback) {
        console.log('Client: ' + arg1);
        console.log('Client: ' + arg2);
        console.log('Client: ' + arg3);
        console.log('Client: ' + arg4);

        callback(null, 'hello from Client!');
    };

    message.create(socket);

    return message;
};