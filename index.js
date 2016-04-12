var port = process.argv[2];
var seedPort = process.argv[3];

require('./services/server')('localhost', port);
require('./services/client')('localhost', seedPort);
require('./services/client')('localhost', seedPort);

var tokenGenerator = require('./lib/token-generator');
var VnodeService = require('./lib/vnode-service');
var vnodeService = new VnodeService();
var async = require('async');

async.parallel([
    function (callback) {
        tokenGenerator.create(10, function (err, tokens) {
            callback(err, tokens);
        });
    },
    function (callback) {
        tokenGenerator.create(10, function (err, tokens) {
            callback(err, tokens);
        });
    },
    function (callback) {
        tokenGenerator.create(10, function (err, tokens) {
            callback(err, tokens);
        });
    }
], function (err, results) {
    results.forEach(function (tokens, i) {
        vnodeService.add({host: 'node' + i, port: 9000, tokens: tokens});
    });

    tokenGenerator.get('topic1.ch3', function (err, hash) {
        if (err) {
            return console.log(err);
        }

        console.log('Hash: ' + hash);
        var vnode = vnodeService.get(hash);
        console.log(vnode);
    });

    tokenGenerator.get('topic1.ch3', function (err, hash) {
        if (err) {
            return console.log(err);
        }

        console.log('Hash: ' + hash);
        var vnode = vnodeService.getFast(hash);
        console.log(vnode);
    });
});








