require('./config');

const { Storage } = require('./dist/storage');
const { BotManager, CardManager, Main } = require('./dist/game');
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
    const main = new Main();
    return botManager.initBots(main);
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

    const table = bot1.createGame();
    bot2.joinGame(table);

    bot1.playGame(table, createSampleDeck());
    bot2.playGame(table, createSampleDeck());
  })
  .then(() => storage.disconnect());
