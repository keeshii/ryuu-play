require('./config');

const { State, Player, StateLog, ChooseCardsPrompt } = require('./dist/game');
const { CardManager } = require('./dist/game/cards/card-manager');
const { setBlackAndWhite, setDiamondAndPearl, setHgss, setOp9 } = require('./dist/sets');
const { StateSerializer } = require('./dist/game/serializer/state-serializer');
const { config } = require('./dist/config');
const process = require('process');

const cardManager = CardManager.getInstance();
cardManager.defineSet(setDiamondAndPearl);
cardManager.defineSet(setOp9);
cardManager.defineSet(setHgss);
cardManager.defineSet(setBlackAndWhite);

const state = new State();

state.logs.push(new StateLog('111', ['2'], 0));
const player = new Player();
state.players.push(player);
player.deck.cards.push(setOp9[0]);
state.prompts.push(new ChooseCardsPrompt(1, 'aaa', player.deck, {}, {}));

state.players.push(player);

const serializer = new StateSerializer();
serializer.setKnownCards(cardManager.getAllCards());
const data = serializer.serialize(state);
console.log(data);

const restored = serializer.deserialize(data);
console.log(restored);
