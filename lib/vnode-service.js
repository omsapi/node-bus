var TokenRing = require('./token-ring');

function Token() {
    this._nodes = [];
    this._vnodes = {};
    this._tokens = [];
    this._tokenRing = new TokenRing([]);
}

Token.prototype.add = function (node) {
    var self = this;
    this._nodes.push(node);
    this._tokens = this._tokens.concat(node.tokens).sort(function (a, b) {
        return a - b;
    });
    this._tokenRing.add(node.tokens);

    node.tokens.forEach(function (token) {
        self._vnodes[token] = {
            host: node.host,
            port: node.port,
            token: token
        };
    });
};

Token.prototype.get = function (hash) {
    var token = getNearToken(this._tokens, hash);
    var vnode = this._vnodes[token];

    return vnode;
};

Token.prototype.getFast = function (hash) {
    var token = this._tokenRing.find(hash);
    var vnode = this._vnodes[token];

    return vnode;
};

function getNearToken(tokens, hash) {
    var count = 0;
    for (var i = 0; i < tokens.length; i++) {
        count++;
        var token = tokens[i];
        var dif = token - hash;
        if (dif >= 0) {
            console.log('Iteration count: ' + count);
            return token;
        }
    }

    console.log('Iteration count: ' + count);
    return tokens[0];
}

module.exports = Token;
