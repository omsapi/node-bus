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
    var message = createMessage(data);

    addMsg.call(self, topicName, message);

    var remote = nextRmt.call(self, topicName);
    if (remote) {
        var msg = nextMsg.call(self, topicName);
        addPrcs.call(self, topicName, msg);

        remote.execute(msg, function (err) {
            restoreMsg.call(self, topicName, msg);
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
            restoreMsg.call(self, topicName, msg);
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

function addMsg(topicName, message) {
    var topic = this._topics[topicName] = this._topics[topicName] || [];
    topic.push(message);
}

function addRmt(remote) {
    var topicName = remote.topicName;
    var remotes = this._remotesByTopic[topicName] = this._remotesByTopic[topicName] || [];
    remotes.push(remote);
}

function nextMsg(topicName) {
    var topic = this._topics[topicName] = this._topics[topicName] || [];
    var msg = topic.shift();

    return msg;
}

function addPrcs(topicName, message) {
    //var inProcess = this._inProcess[topicName] = this._inProcess[topicName] || new IndexArray();
    var self = this;
    var inProcess = this._inProcessTopics.add(topicName, new IndexArray());

    if (!this._timeouts[topicName]) {
        this._timeouts[topicName] = true;
        checkTmt.call(this, topicName, inProcess);
    }

    inProcess.add(message.id, message);
}

function checkTmt(topicName, inProcess) {
    var self = this;
    setTimeout(function () {
        inProcess.forEach(function (msg) {
            if (msg.lastUpdate + 5000 < moment.now()) {
                restoreMsg.call(self, topicName, msg);
            }
        });

        checkTmt.call(self, topicName, inProcess);
    }, 1000);
}

function nextRmt(topicName) {
    var remotes = this._remotesByTopic[topicName] = this._remotesByTopic[topicName] || [];
    var remote = remotes.shift();

    return remote;
}

function restoreMsg(topicName, message) {
    var self = this;

    removePrcs.call(self, topicName, message.id);
    addMsg.call(self, topicName, message);

    var remote = nextRmt.call(self, topicName);
    if (remote) {
        var msg = nextMsg.call(self, topicName);
        addPrcs.call(self, topicName, msg);

        remote.execute(msg, function (err) {
            restoreMsg.call(self, topicName, msg);
        });
    }
}

function removePrcs(topicName, msgId) {
    //var inProcess = this._inProcess[topicName] = this._inProcess[topicName] || new IndexArray();
    var inProcess = this._inProcessTopics.get(topicName);

    inProcess.remove(msgId);
}

module.exports = TopicService;