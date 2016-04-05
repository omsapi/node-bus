var shortid = require('shortid');

module.exports = function (socket) {
    var getCallbacks = {};
    var setCallbacks = {};
    var buffer;
    socket.on('data', function (data) {
        console.log('Receive: ' + data);

        //setTimeout(function(){
        var msg = JSON.parse(data);
        switch (msg.type) {
            case 'request':
                request(msg);
                break;
            case 'response':
                response(msg);
                break;
        }
        //}, 0);
    });

    function response(msg) {
        var callback = getCallbacks[msg.id];

        if (msg.err) {
            return callback(msg.err);
        }

        callback(null, msg.data);
    }

    function request(query) {
        var callback = setCallbacks[query.method];
        var obj = callback(query.data);
        var msg = {
            id: query.id,
            type: 'response',
            method: query.method,
            data: obj,
            err: null
        };
        var str = JSON.stringify(msg);
        str = str.length + '#' + str;

        socket.write(str);
    }

    return {
        get: function (method, data, callback) {
            var id = shortid.generate();
            var query = {
                id: id,
                type: 'request',
                method: method,
                data: data
            };

            getCallbacks[id] = callback;

            var str = JSON.stringify(query);
            str = str.length + '#' + str;

            socket.write(str);
        },
        set: function (method, callback) {
            setCallbacks[method] = callback;
        }
    }
};
