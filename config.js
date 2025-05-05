const { config } = require('@ptcg/server');

config.backend.address = 'localhost';
config.backend.port = 12021;
config.backend.avatarsDir = __dirname + '/avatars';

config.storage.type = 'sqlite';
config.storage.database = __dirname + '/database.sq3';

config.bots.defaultPassword = 'bot';

config.sets.scansDir = __dirname + '/scans';
