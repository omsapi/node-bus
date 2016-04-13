function TokenRing(tokens) {
    this._tokens = tokens;
    this._step = (4294967295 + 1) / this._tokens.length;
}

TokenRing.prototype.add = function (tokens) {
    this._tokens = this._tokens.concat(tokens).sort(function (a, b) {
        return a - b;
    });
};

TokenRing.prototype.find = function (position) {
    var self = this;
    var index = (position / this._step) | 0;
    var token = this._tokens[index];
    var length = this._tokens.length;
    var diff = position - token;
    var direction = diff >= 0 ? 1 : -1;
    var offset = direction > 0 ? 0 : -1;

    while (true) {
        if (index >= length || index + offset < 0) {
            return self._tokens[0];
        }

        var curDiff = position - self._tokens[index + offset];

        if (direction * curDiff <= 0) {
            return self._tokens[index];
        }

        index += direction;
    }
};

module.exports = TokenRing;