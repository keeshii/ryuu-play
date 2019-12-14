import { Action } from "../actions/action";
import { PassTurnAction } from "../actions/pass-turn-action";
import { Player } from "../state/player";
import { State, GamePhase } from "../state/state";
import { StoreLike } from "../store-like";
import {GameError, GameMessage} from "../../game-error";

function getActivePlayer(state: State): Player {
  return state.players[state.activePlayer];
}

export async function betweenTurns(store: StoreLike, state: State) {

  if (state.phase === GamePhase.PLAYER_TURN) {
    state.phase = GamePhase.BETWEEN_TURNS;
    return;
  }

}

export async function nextTurn(store: StoreLike, state: State) {
  if ([GamePhase.SETUP, GamePhase.BETWEEN_TURNS].indexOf(state.phase) === -1) {
    return;
  }

  let player: Player = getActivePlayer(state);

  if (state.phase === GamePhase.SETUP) {
    state.phase = GamePhase.PLAYER_TURN;
  }

  if (state.phase === GamePhase.BETWEEN_TURNS) {
    state.activePlayer = state.activePlayer ? 0 : 1;
    state.phase = GamePhase.PLAYER_TURN;
    player = getActivePlayer(state);
  }

  state.turn++;
  console.log('Next turn ' + state.turn);

  // Draw card at the beginning
  console.log('Draw card, cards left ' + player.deck.cards.length);
  if (player.deck.cards.length === 0) {
    console.log('Game finished, no more cards in deck');
    state.winner = state.activePlayer ? 0 : 1;
    console.log('Winner ' + state.players[state.winner].name);
    state.phase = GamePhase.FINISHED;
    return;
  }

  player.deck.moveTo(player.hand, 1);
}

export async function playerTurnReducer(store: StoreLike, state: State, action: Action) {

  if (state.phase === GamePhase.PLAYER_TURN) {
    if (action instanceof PassTurnAction) {
      const player = state.players[state.activePlayer];

      if (player === undefined || player.id !== action.clientId) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }

      console.log('Pass action by player ' + player.name);
      await betweenTurns(store, state);
      await nextTurn(store, state);
    }
  }

}
