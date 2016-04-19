var Q = require('q');

function DeferredArray() {
    this._deferreds = [];
    this._values = [];
}

DeferredArray.prototype.add = function (value) {
    var deferred = this._deferreds.shift();
    if (deferred) {
        deferred.resolve(value);
    } else {
        this._values.push(value);
    }
};

DeferredArray.prototype.next = function () {
    var deferred = new Q.defer();
    var value = this._values.shift();

    if (value) {
        deferred.resolve(value);
    } else {
        this._deferreds.push(deferred);
    }

    return deferred.promise;
};