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

cardManager.defineFormat('Standard', [
  standardSets.setDiamondAndPearl,
  standardSets.setOp9,
  standardSets.setHgss,
  standardSets.setBlackAndWhite,
  standardSets.setBlackAndWhite2,
  standardSets.setBlackAndWhite3,
  standardSets.setBlackAndWhite4,
  standardSets.setSwordAndShield
]);

cardManager.defineFormat('EX Sets', [
  exSets.setRubyAndSapphire
]);


// Not implemented yet
// cardManager.defineFormat('Base Sets', [
//   baseSets.setBase
// ]);

// Define bots
const botManager = BotManager.getInstance();
botManager.registerBot(new SimpleBot('bot'));
