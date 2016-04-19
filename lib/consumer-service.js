module.exports = function (topics, remotes) {
    var topic = topics[0];
    var remote = remotes[0];

    function next() {
        topic.next().then(function (msg) {
            remote.next()
                .then(function (callback) {
                    callback(null, msg);
                    next();
                })
                .catch(function (err) {
                    // TODO: restore msg if remote failed
                    //topic.restore(msg);
                });
        });
    }

    next();
};