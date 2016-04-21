var moment = require('moment');
var shortid = require('shortid');

var IndexArray = require('./index-array');

function TopicService() {
    this._topics = {};
    //this._inProcess = {};
    this._inProcessTopics = new IndexArray();
    this._remotesByTopic = {};
    this._timeouts = {};
}

TopicService.prototype.add = function (topicName, data) {
    var self = this;
    this._topics.add(topicName, data);
    var remote = this._remotes.next(topicName);

    if (remote) {
        this._topics.next(topicName, function (message) {
            remote.execute(message, function (err) {
                if (err) {
                    self._topics.restore(topicName, message)
                }
            });
        });
    }

    var message = createMessage(data);

    addMsg.call(self, topicName, message);

    var remote = nextRmt.call(self, topicName);
    if (remote) {
        var msg = nextMsg.call(self, topicName);
        addPrcs.call(self, topicName, msg);

        remote.execute(msg, function (err) {
            if (err) {
                restoreMsg.call(self, topicName, msg);
            }
        });
    }
};

TopicService.prototype.addRemote = function (remote) {
    var self = this;
    var topicName = remote.topicName;

    addRmt.call(self, remote);

    var msg = nextMsg.call(self, topicName);
    if (msg) {
        addPrcs.call(self, topicName, msg);

        var rmt = nextRmt.call(self, topicName);
        rmt.execute(msg, function (err) {
            if (err) {
                restoreMsg.call(self, topicName, msg);
            }
        });
    }
};

TopicService.prototype.finishMsg = function (topicName, msgId, callback) {
    removePrcs.call(this, topicName, msgId);
    callback(null);
};

function createMessage(data) {
    var timeStamp = moment.now();
    return {
        id: shortid.generate(),
        data: data,
        attempts: 0,
        created: timeStamp,
        lastUpdate: timeStamp
    };
}