function IndexArray() {
    this._array = [];
    this._keys = {};
}

IndexArray.prototype.add = function (key, value) {
    var obj = {
        key: key,
        value: value,
        index: this._array.length
    };

    this._keys[key] = obj;
    this._array.push(obj);
};

IndexArray.prototype.next = function () {
    var obj = this._array.shift();
    if (obj) {
        delete this._keys[obj.value];
        return obj.value;
    }

    return null;
};


IndexArray.prototype.get = function (key) {
    var obj=this._keys[key];
    if(obj){
        this._array.splice(obj.index, 1);
        return obj.value;
    }

    return null;
};

IndexArray.prototype.next = function () {

};


module.exports = IndexArray;