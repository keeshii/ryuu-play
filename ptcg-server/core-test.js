require('./config');

const { Storage } = require('./dist/storage');
const { BotManager } = require('./dist/game/bots/bot-manager');
const { CardManager } = require('./dist/game/cards/card-manager');
const { Core } = require('./dist/game/core/core');
const { SimpleBot } = require('./dist/simple-bot/main');
const { basicSet } = require('./dist/sets/basic-set/basic-set');
const { config } = require('./dist/config');
const process = require('process');

const cardManager = CardManager.getInstance();
cardManager.defineSet(basicSet);

const botManager = BotManager.getInstance();
botManager.registerBot(new SimpleBot('bot1'));
botManager.registerBot(new SimpleBot('bot2'));

const storage = new Storage();
storage.connect()
  .catch(error => {
    console.log('Unable to connect to database.');
    console.error(error.message);
    process.exit(1);
  })
  .then(() => {
    const core = new Core();
    return botManager.initBots(core);
  })
  .then(() => {
    const bot1 = botManager.getBot('bot1');
    const bot2 = botManager.getBot('bot2');

    function createSampleDeck() {
      const deck = [];
      for (let i = 0; i < 56; i++) {
        deck.push('Water Energy EVO');
      }
      for (let i = 0; i < 4; i++) {
        deck.push('Buizel GE');
      }
      return deck;
    }

    const game = bot1.createGame();
    bot2.joinGame(game);

    bot1.playGame(game, createSampleDeck());
    bot2.playGame(game, createSampleDeck());
  })
  .then(() => storage.disconnect());
