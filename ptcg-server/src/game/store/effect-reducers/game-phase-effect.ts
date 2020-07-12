import { GameError, GameMessage } from "../../game-error";
import { Effect } from "../effects/effect";
import { State, GamePhase, GameWinner } from "../state/state";
import { StoreLike } from "../store-like";
import { Player } from "../state/player";
import { EndTurnEffect } from "../effects/game-phase-effects";
import { checkState, endGame } from "./check-state-effect";

function getActivePlayer(state: State): Player {
  return state.players[state.activePlayer];
}

export function betweenTurns(store: StoreLike, state: State): State {
  if (state.phase === GamePhase.PLAYER_TURN) {
    state.phase = GamePhase.BETWEEN_TURNS;
  }
  return state;
}

export function nextTurn(store: StoreLike, state: State): State {
  if ([GamePhase.SETUP, GamePhase.BETWEEN_TURNS].indexOf(state.phase) === -1) {
    return state;
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
  store.log(state, `Turn ${state.turn}.`);

  // Draw card at the beginning
  store.log(state, `${player.name} draws a card.`);
  if (player.deck.cards.length === 0) {

    store.log(state, `${player.name} has no more cards in the deck.`);
    const winner = state.activePlayer ? GameWinner.PLAYER_1 : GameWinner.PLAYER_2;
    state = endGame(store, state, winner);
    return state;
  }

  player.deck.moveTo(player.hand, 1);
  return state;
}



export function gamePhaseReducer(store: StoreLike, state: State, effect: Effect): State {

  if (effect instanceof EndTurnEffect) {
    const player = state.players[state.activePlayer];

    if (player === undefined) {
      throw new GameError(GameMessage.NOT_YOUR_TURN);
    }

    state = checkState(store, state, () => {
      if (state.phase === GamePhase.FINISHED) {
        return;
      }

      store.log(state, `${player.name} ends the turn.`);
      state = betweenTurns(store, state);
      state = nextTurn(store, state);
    });

    return state;
  }

  return state;
}
