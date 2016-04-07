var shortid = require('shortid');
var Schema = require('./schema');
var Protocol = require('../lib/socket-protocol');

exports.Schema = Schema;
exports.create = function (schema) {
    return function (socket) {
        var callbacks = {};
        var self = this;

        var remotes = schema.remotes;
        var methods = schema.methods;

        var protocol = new Protocol(socket);

        remotes.forEach(function (funcName) {
            self[funcName] = function () {
                var pos = arguments.length - 1;
                var args = [].slice.call(arguments, 0, pos);
                var callback = arguments[pos];

                //TODO: need????????????
                var id = shortid.generate();

                var msg = {
                    id: id,
                    data: args
                };

                //TODO: methodName?????????
                //callbacks[id] = callback;
                callbacks[funcName] = callback;

                protocol.on(Protocol.RESPONSE, function (msg) {
                    //var func = callbacks[msg.id];
                    var func = callbacks[funcName];
                    var args = [msg.err].concat(msg.data);
                    func.apply(this, args);
                    //delete callbacks[msg.id];
                    delete callbacks[funcName];
                });

                protocol.send(Protocol.REQUEST, funcName, msg);
            };
        });

        for (var methodName in methods) {
            var method = methods[methodName];
            var eventHandler = (function (method) {
                return function (msg) {
                    var callback = function () {
                        var args = [].slice.call(arguments, 1);
                        var err = arguments[0];

                        var respMsg = {
                            id: msg.id,
                            data: args,
                            err: err
                        };

                        protocol.send(Protocol.RESPONSE, methodName, respMsg);
                    };

                    var args = msg.data.concat(callback);

                    method.apply(this, args);
                };
            })(method);

            protocol.on(methodName, eventHandler);
        }
    };
};
