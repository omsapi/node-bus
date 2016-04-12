function Token() {
    this._nodes = [];
    this._vnodes = {};
    this._tokens = [];
}

Token.prototype.add = function (node) {
    var self = this;
    this._nodes.push(node);
    this._tokens = this._tokens.concat(node.tokens).sort(function (a, b) {
        return a - b;
    });

    node.tokens.forEach(function (token) {
        self._vnodes[token] = {
            host: node.host,
            port: node.port,
            token: token
        };
    });

    console.log(this._vnodes);
};

Token.prototype.get = function (hash) {
    var token = getNearToken(this._tokens, hash);
    var vnode = this._vnodes[token];

    return vnode;
};

function getNearToken(tokens, hash) {
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        var dif = token - hash;
        if (dif >= 0) {
            return token;
        }
    }

    return tokens[0];
}

module.exports = Token;
