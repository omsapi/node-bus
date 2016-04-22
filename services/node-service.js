function NodeService() {
    this._nodes = [];
}

NodeService.prototype.addNode = function (node) {
    addNode.call(this, node);
};

NodeService.prototype.sendData = function (topicName, data, callback) {
    var node = getNode.call(this, topicName);
    node.sendData(topicName, data, function (err) {
        callback(err);
    })
};

function addNode(node) {
    this._nodes.push(node);
}

function getNode(topicName) {
    return this._nodes[0];
}

module.exports = NodeService;