const { config } = require('./dist/config');

config.backend.address = 'localhost';
config.backend.port = 12021;

config.core.debug = true;

config.sets.scansDir = __dirname + '/scans';
