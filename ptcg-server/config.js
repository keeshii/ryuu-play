const { config } = require('./dist/config');

config.backend.address = 'localhost';
config.backend.port = 12021;
config.backend.avatarsDir = __dirname + '/avatars';

config.core.debug = true;

config.sets.scansDir = __dirname + '/scans';
