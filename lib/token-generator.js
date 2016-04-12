var mmr3 = require('murmurhash3');
var async = require('async');

exports.create = function (num, callback) {
    var arr = getKeys(num);
    var tasks = arr.map(function (key) {
        return function (cb) {
            getMurmurHash(key, cb);
        };
    });

    async.parallel(tasks, function (err, results) {
        callback(err, results);
    });
};

function getKeys(num) {
    var arr = new Array(num);
    for (var i = 0; i < num; i++) {
        var rnd = Math.random();
        arr[i] = rnd;
    }

    return arr;
}

function getMurmurHash(key, callback) {
    mmr3.murmur32(key.toString(), function (err, hash) {
        if (err) {
            callback(err);
        }

        callback(null, hash);
    });
}