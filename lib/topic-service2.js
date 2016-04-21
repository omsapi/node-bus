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

TopicService.prototype.add = function (topicName, data, callback) {
    this._topics.add(topicName, data, function(err){
        if(err){
            return callback(err);
        }

        callback(null);
    });
};

TopicService.prototype.addRemote = function (remote, callback) {
    var topicName = remote.topicName;

    this._topics.addRemote(topicName, remote, function(err){
        if(err){
            return callback(err);
        }

        callback(null);
    });
};

TopicService.prototype.finishMsg = function (topicName, msgId, callback) {
    this._topics.finish(topicName, msgId, function(err){
        if(err){
            return callback(err);
        }

        callback(null);
    });
};

TopicService.prototype.touchMsg = function (topicName, msgId, callback) {
    this._topics.touch(topicName, msgId, function(err){
        if(err){
            return callback(err);
        }

        callback(null);
    });
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