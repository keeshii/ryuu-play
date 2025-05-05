require('./config');

const { App } = require('./dist/cjs/backend/app');
const { BotManager } = require('./dist/cjs/game/bots/bot-manager');
const { SimpleBot } = require('./dist/cjs/simple-bot/simple-bot');
const { CardManager } = require('./dist/cjs/game/cards/card-manager');
const { StateSerializer } = require('./dist/cjs/game/serializer/state-serializer');
const { config } = require('./dist/cjs/config');
const sets = require('./dist/cjs/sets');
const process = require('process');

const cardManager = CardManager.getInstance();
cardManager.defineSet(sets.setDiamondAndPearl);
cardManager.defineSet(sets.setOp9);
cardManager.defineSet(sets.setHgss);
cardManager.defineSet(sets.setBlackAndWhite);
cardManager.defineSet(sets.setBlackAndWhite2);
cardManager.defineSet(sets.setBlackAndWhite3);
cardManager.defineSet(sets.setBlackAndWhite4);
cardManager.defineSet(sets.setSwordAndShield);

StateSerializer.setKnownCards(cardManager.getAllCards());

const botManager = BotManager.getInstance();
botManager.registerBot(new SimpleBot('bot'));

const app = new App();

app.connectToDatabase()
  .catch(error => {
    console.log('Unable to connect to database.');
    console.error(error.message);
    process.exit(1);
  })
  .then(() => app.configureBotManager(botManager))
  .then(() => app.start())
  .then(() => {
    const address = config.backend.address;
    const port = config.backend.port;
    console.log('Application started on ' + address + ':' + port + '.');
  })
  .catch(error => {
    console.error(error.message);
    console.log('Application not started.');
    process.exit(1);
  });
