var Q = require('q');
var IndexArray = require('./index-array');

function Remote() {
    //this._callbacks = new IndexArray();
    //this._deferreds = new IndexArray();
    this._deferreds = [];
    this._callbacks = [];
    this._deferred = new Q.defer();
}

Remote.prototype.add = function (clientId, callback) {
    var deferred = this._deferreds.shift();
    if (deferred) {
        deferred.resolve(callback);
    } else {
        this._callbacks.push(callback);
    }
};

Remote.prototype.next = function () {
    var deferred = new Q.defer();
    var callback = this._callbacks.shift();

    if (callback) {
        deferred.resolve(callback);
    } else {
        this._deferreds.push(deferred);
    }

    return deferred.promise;
};


//////////////////////////////////////
//Remote.prototype.add = function (clientId, callback) {
//    if (this._deferred) {
//        this._deferred.resolve(callback);
//        return;
//    }
//
//    this._callbacks.add(clientId, callback);
//};
//
//Remote.prototype.next = function () {
//    var callback = this._callbacks.next();
//
//    if (callback) {
//        var deferred = new Q.defer();
//        deferred.resolve(callback);
//        return deferred.promise;
//    }
//
//    this._deferred = new Q.defer();
//    return this._deferred.promise;
//    //var promise=this._deferred.promise;
//    //delete this._deferred;
//    //
//    //return promise;
//};

module.exports = Remote;