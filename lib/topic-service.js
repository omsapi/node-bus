var moment = require('moment');

function TopicService() {
    this._topics = {};
    this._remotesByTopic = {};
}

TopicService.prototype.add = function (topicName, data) {
    var self = this;
    var message = createMessage(data);

    addMsg.call(self, topicName, message);

    var remote = nextRmt.call(self, topicName);
    console.log('add');
    if (remote) {
        var msg = nextMsg.call(self, topicName);
        remote.execute(msg, function (err) {
            if (err) {
                console.log(err);
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
    console.log('addRemote');
    if (msg) {
        var rmt = nextRmt.call(self, topicName);
        rmt.execute(msg, function (err) {
            if (err) {
                console.log(err);
                restoreMsg.call(self, topicName, msg);
            }
        });
    }
};

function createMessage(data) {
    return {
        data: data,
        created: moment.utc(),
        lastUpdate: moment.utc()
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
    var topic = this._topics[topicName] || [];
    var msg = topic.shift();

    return msg;
}

function nextRmt(topicName) {
    var remotes = this._remotesByTopic[topicName] || [];
    var remote = remotes.shift();

    return remote;
}

function restoreMsg(topicName, message) {
    var self = this;

    addMsg.call(self, topicName, message);

    var remote = nextRmt.call(self, topicName);
    console.log('restore');
    if (remote) {
        var msg = nextMsg.call(self, topicName);
        remote.execute(msg, function (err) {
            if (err) {
                console.log(err);
                restoreMsg.call(self, msg);
            }
        });
    }
}

module.exports = TopicService;