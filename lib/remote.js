function Remote(topicName, channelName, callback) {
    this.topicName = topicName;
    this.channelName = channelName;

    this._callback = callback;
    this._errCallback=function(){};
}

Remote.prototype.execute = function (msg, errCallback) {
    this._errCallback=errCallback;
    this._callback(null, msg);

    //if (this._err) {
    //    return errCallback(this._err);
    //}
    //
    //errCallback(null);
};

Remote.prototype.sendError = function (err) {
    console.log('!!!!ERROR!!!!');
    console.log(err);
    console.log('!!!!ERROR!!!!');
    this._errCallback(err)
};

module.exports = Remote;