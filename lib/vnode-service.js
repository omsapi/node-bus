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

    //console.log(this._vnodes);
};

Token.prototype.get = function (hash) {
    var token = getNearToken(this._tokens, hash);
    var vnode = this._vnodes[token];

    return vnode;
};

// TODO: Edge hash > token_max_value
Token.prototype.getFast = function (hash) {
    var count = 0;
    var step = 4294967295 / this._tokens.length;
    var index = Math.round(hash / step);
    var flag = true;
    while (flag) {
        count++;
        var token = this._tokens[index];
        var dif1 = token - hash;
        var dif2 = this._tokens[index + 1] - hash;
        if(dif1<0){
            index++;
            continue;
        }else if (dif1 >= 0 && dif2 >= 0) {
            index--;
            continue;
        }else if (dif1 >= 0 && dif2 <= 0) {
            console.log('Iteration count: ' + count);
            return token;
        }
    }
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
