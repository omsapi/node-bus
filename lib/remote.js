function Remote(topicName, channelName, res) {
    this.topicName = topicName;
    this.channelName = channelName;

    this._res = res;
}

Remote.prototype.execute = function (msg, callback) {
    this._res.onResult(callback);
    this._res.send(null, msg);
};

module.exports = Remote;