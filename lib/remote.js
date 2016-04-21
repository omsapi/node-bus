function Remote(topicName, channelName, res) {
    this.topicName = topicName;
    this.channelName = channelName;

    this._res = res;
}

Remote.prototype.send = function (err, msg) {
    this._res.onResult(callback);
    this._res.send(null, msg);
};

Remote.prototype.onResult

module.exports = Remote;