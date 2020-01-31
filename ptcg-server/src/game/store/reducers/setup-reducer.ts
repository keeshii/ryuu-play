import { Action } from "../actions/action";
import { AddPlayerAction } from "../actions/add-player-action";
import { AlertPrompt } from "../prompts/alert-prompt";
import { Card } from "../card/card";
import { CardList } from "../state/card-list";
import { CoinFlipPrompt } from "../prompts/coin-flip-prompt";
import { ConfirmPrompt } from "../prompts/confirm-prompt";
import { ChooseCardsPrompt } from "../prompts/choose-cards-prompt";
import { Player } from "../state/player";
import { ShuffleDeckPrompt } from "../prompts/shuffle-prompt";
import { State, GamePhase } from "../state/state";
import { GameError, GameMessage } from "../../game-error";
import { StoreLike } from "../store-like";
import { SuperType, Stage } from "../card/card-types";
import { nextTurn } from "./player-turn-reducer";


function putStartingPokemons(player: Player, cards: Card[]): void {
  if (cards.length === 0) {
    return;
  }
  player.hand.moveCardTo(cards[0], player.active);
  for (let i = 0; i < cards.length; i++) {
    player.hand.moveCardTo(cards[i], player.bench[i - 1]);
  }
}

function* setupGame(next: Function, store: StoreLike, state: State): IterableIterator<State> {
  const basicPokemon = {superType: SuperType.POKEMON, stage: Stage.BASIC};
  const chooseCardsOptions = { min: 1, max: 6, allowCancel: false };
  const player = state.players[0];
  const opponent = state.players[1];

  let playerHasBasic = false;
  let opponentHasBasic = false;

  while (!playerHasBasic || !opponentHasBasic) {
    if (!playerHasBasic) {
      player.hand.moveTo(player.deck);
      yield store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
        player.deck.moveTo(player.hand, 7);
        playerHasBasic = player.hand.count(basicPokemon) > 0;
        next();
      });
    }

    if (!opponentHasBasic) {
      opponent.hand.moveTo(opponent.deck);
      yield store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
        opponent.deck.applyOrder(order);
        opponent.deck.moveTo(opponent.hand, 7);
        opponentHasBasic = opponent.hand.count(basicPokemon) > 0;
        next();
      });
    }

    if (playerHasBasic && !opponentHasBasic) {
      yield store.prompt(state, [
        new ConfirmPrompt(player.id, GameMessage.SETUP_OPPONENT_NO_BASIC),
        new AlertPrompt(opponent.id, GameMessage.SETUP_PLAYER_NO_BASIC)
      ], results => {
        if (results[0]) {
          player.deck.moveTo(player.hand, 1);
        }
        next();
      });
    }

    if (!playerHasBasic && opponentHasBasic) {
      yield store.prompt(state, [
        new ConfirmPrompt(opponent.id, GameMessage.SETUP_OPPONENT_NO_BASIC),
        new AlertPrompt(player.id, GameMessage.SETUP_PLAYER_NO_BASIC)
      ], results => {
        if (results[0]) {
          opponent.deck.moveTo(player.hand, 1);
        }
        next();
      });
    }
  }

  yield store.prompt(state, [
    new ChooseCardsPrompt(player.id, GameMessage.CHOOSE_STARTING_POKEMONS,
      player.deck, basicPokemon, chooseCardsOptions),
    new ChooseCardsPrompt(opponent.id, GameMessage.CHOOSE_STARTING_POKEMONS,
      opponent.deck, basicPokemon, chooseCardsOptions)
  ], choice => {
    putStartingPokemons(player, choice[0]);
    putStartingPokemons(opponent, choice[1]);
    next();
  });

  yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.SETUP_WHO_BEGINS_FLIP), whoBegins => {
    state.activePlayer = whoBegins ? 0 : 1;
    next();
  });

  return nextTurn(store, state);
}


export function setupPhaseReducer(store: StoreLike, state: State, action: Action): State {

  if (state.phase === GamePhase.WAITING_FOR_PLAYERS) {

    if (action instanceof AddPlayerAction) {

      if (state.players.length >= 2) {
        throw new GameError(GameMessage.MAX_PLAYERS_REACHED);
      }

      let player = new Player();
      player.id = action.clientId;
      player.name = action.name;
      player.deck = CardList.fromList(action.deck);
      state.players.push(player);

      if (state.players.length === 2) {
        state.phase = GamePhase.SETUP;
        let generator: IterableIterator<State>;
        generator = setupGame(() => generator.next(), store, state);
        return generator.next().value;
      }

    }
  }

  return state;
}
