require('./config');

const { Storage } = require('./dist/storage');
const { BotManager } = require('./dist/game/bots/bot-manager');
const { CardManager } = require('./dist/game/cards/card-manager');
const { LobbyRoom } = require('./dist/game/rooms/lobby-room');
const { SimpleBot } = require('./dist/simple-bot/main');
const { basicSet } = require('./dist/sets/basic-set/basic-set');
const { config } = require('./dist/config');
const process = require('process');

const cardManager = CardManager.getInstance();
cardManager.defineSet(basicSet);

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
    const lobbyRoom = new LobbyRoom();
    return botManager.initBots(lobbyRoom);
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

    const game1 = bot1.createGame();
    const game2 = bot2.joinGame(game1.room.id);

    bot1.playGame(game1, createSampleDeck());
    bot2.playGame(game2, createSampleDeck());
  })
  .then(() => storage.disconnect());
