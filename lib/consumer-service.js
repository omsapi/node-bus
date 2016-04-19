function ConsumerService(topics){
    this._topics=topics;
}

ConsumerService.prototype.addRemote=function(clientId, callback){

}

module.exports = function (topics, remotes) {
    var topic = topics[0];
    var remote = remotes[0];

    //function next() {
    //    topic.next().then(function (msg) {
    //        remote.next()
    //            .then(function (callback) {
    //                callback(null, msg);
    //                next();
    //            })
    //            .catch(function (err) {
    //                // TODO: restore msg if remote failed
    //                //topic.restore(msg);
    //            });
    //    });
    //}

    function next() {
        remote.next().then(function (callback) {
            topic.next().then(function (msg) {
                callback(null, msg, function (err) {
                    if (err) {
                        topic.restore(msg);
                    }
                });
                next();
            }).catch(function (err) {
                // TODO: restore msg if remote failed
                //topic.restore(msg);
            });
        });
    }

    next();
};