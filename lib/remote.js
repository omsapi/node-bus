function Remote(topicName, channelName, res) {
    this.topicName = topicName;
    this.channelName = channelName;

    this._res = res;
}

Remote.prototype.execute = function (msg, errCallback) {
    this._res.onError(errCallback);
    this._res.send(null, msg);
};

module.exports = Remote;