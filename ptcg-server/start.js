require('./config');

const { App } = require('./dist/backend/app');
const { BotManager } = require('./dist/game/bots/bot-manager');
const { DebugBot } = require('./dist/simple-bot/debug-bot');
const { CardManager } = require('./dist/game/cards/card-manager');
const { StateSerializer } = require('./dist/game/serializer/state-serializer');
const { setBlackAndWhite, setDiamondAndPearl, setHgss, setOp9 } = require('./dist/sets');
const { config } = require('./dist/config');
const process = require('process');

const cardManager = CardManager.getInstance();
cardManager.defineSet(setDiamondAndPearl);
cardManager.defineSet(setOp9);
cardManager.defineSet(setHgss);
cardManager.defineSet(setBlackAndWhite);

StateSerializer.setKnownCards(cardManager.getAllCards());

const botManager = BotManager.getInstance();
botManager.registerBot(new DebugBot('computer'));

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
