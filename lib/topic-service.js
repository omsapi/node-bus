var Q = require('q');
var IndexArray = require('./index-array');

function TopicService(topic) {
    this._topic = topic;
    this._deferreds = new IndexArray();
}

TopicService.prototype.next = function (clientId, callback) {
    this._topic.next(function (err, msg) {

    });

    if (!msg) {
        var deferred = Q.defer();
        deferred.promise
            .then(function (msg) {
                callback(null, msg);
            })
            .catch(function (err) {
                callback(err);
            });
        return this._deferreds.add(clientId, deferred);
    }

    callback(null, msg);
};