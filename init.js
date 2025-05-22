const { BotManager, SimpleBot, config } = require('@ptcg/server');
const { CardManager } = require('@ptcg/common');

// Backend config
config.backend.address = 'localhost';
config.backend.port = 12021;
config.backend.avatarsDir = __dirname + '/avatars';
config.backend.webUiDir = __dirname + '/packages/play/dist/ptcg-play';

// Storage config
config.storage.type = 'sqlite';
config.storage.database = __dirname + '/database.sq3';

// Bots config
config.bots.defaultPassword = 'bot';

// Sets/scans config
config.sets.scansDir = __dirname + '/scans';
config.sets.scansDownloadUrl = 'https://ptcg.ryuu.eu/scans'; // Server to download missing scans

// Define available sets
const { baseSets, exSets, standardSets } = require('@ptcg/sets');

const cardManager = CardManager.getInstance();

// Not implemented yet
/*
cardManager.defineFormat('Base Sets', [
  baseSets.setBase
]);

cardManager.defineFormat('EX Sets', [
  exSets.setRubyAndSapphire
]);
*/

cardManager.defineSet(standardSets.setDiamondAndPearl);
cardManager.defineSet(standardSets.setOp9);
cardManager.defineSet(standardSets.setHgss);
cardManager.defineSet(standardSets.setBlackAndWhite);
cardManager.defineSet(standardSets.setBlackAndWhite2);
cardManager.defineSet(standardSets.setBlackAndWhite3);
cardManager.defineSet(standardSets.setBlackAndWhite4);
cardManager.defineSet(standardSets.setSwordAndShield);

// Define bots
const botManager = BotManager.getInstance();
botManager.registerBot(new SimpleBot('bot'));
