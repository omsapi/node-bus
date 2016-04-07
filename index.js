var port = process.argv[2];
var seedPort = process.argv[3];

require('./services/server')('localhost', port);
require('./services/client')('localhost', seedPort);
require('./services/client')('localhost', seedPort);


