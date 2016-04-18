var Q = require('q');

function DeferredArray() {
    this._array = [];
    this._deferred = Q.defer();
}

DeferredArray.prototype.add = function (value) {
    this._array.push(value);
    this._deferred.promise.then(function (callback) {
        callback(value);
    });
};