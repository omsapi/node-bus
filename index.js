var port = process.argv[2];
var seedPort = process.argv[3];

require('./lib/server')('localhost', port);
require('./lib/client')('localhost', seedPort);


