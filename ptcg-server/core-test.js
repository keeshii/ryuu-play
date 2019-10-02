require('./config');

const { Storage } = require('./dist/storage');
const { BotManager, CardManager, Game } = require('./dist/game');
const { SimpleBot } = require('./dist/simple-bot/main');
const { config } = require('./dist/config');
const process = require('process');

const cardManager = CardManager.getInstance();
cardManager.defineCard('Water Energy');
cardManager.defineCard('Buizel GE');

const botManager = BotManager.getInstance();
botManager.registerBot('bot1', SimpleBot);
botManager.registerBot('bot2', SimpleBot);

const storage = new Storage();
storage.connect()
  .catch(error => {
    console.log('Unable to connect to database.');
    console.error(error.message);
    process.exit(1);
  })
  .then(() => {
    const game = new Game();
    return botManager.initBots(game);
  })
  .then(() => {
    const bot1 = botManager.getBot('bot1');
    const bot2 = botManager.getBot('bot2');

    function createSampleDeck() {
      const deck = [];
      for (let i = 0; i < 56; i++) {
        deck.push('Water Energy');
      }
      for (let i = 0; i < 4; i++) {
        deck.push('Buizel GE');
      }
      return deck;
    }

    const table = bot1.createTable();
    bot2.joinTable(table);

    bot1.playTable(table, createSampleDeck());
    bot2.playTable(table, createSampleDeck());
  })
  .then(() => storage.disconnect());
