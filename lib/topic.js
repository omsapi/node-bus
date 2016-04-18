var Q = require('q');
var IndexArray = require('./index-array');

function Topic() {
    this._messages = [];
    this._deferreds = new IndexArray();
}

Topic.prototype.add = function (msg) {
    var deferred = this._deferreds.next();
    if (deferred) {
        deferred.resolve(msg);
    } else {
        addMessage.call(this, msg);
    }
};

Topic.prototype.addClient=function(clientId, callback){
    this._deferreds.add(clientId, callback);
};

Topic.prototype.next = function (clientId, callback) {
    var msg = nextMessage.call(this);

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

function addMessage(msg){
    this._messages.push(msg);
}

function nextMessage(){
    return this._messages.shift();
}

module.exports = Topic;