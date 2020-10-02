import { Action } from "../actions/action";
import { State, GamePhase, GameWinner } from "../state/state";
import { GameError, GameMessage } from "../../game-error";
import { StoreLike } from "../store-like";
import { AbortGameAction, AbortGameReason} from "../actions/abort-game-action";
import { endGame } from "../effect-reducers/check-effect";
import {StateUtils} from "../state-utils";


export function abortGameReducer(store: StoreLike, state: State, action: Action): State {

  if (state.phase !== GamePhase.FINISHED && action instanceof AbortGameAction) {

    const culprit = state.players.find(p => p.id === action.culpritId);
    if (culprit === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    // Mark all prompts as resolved, so they won't mess with our state anymore.
    state.prompts.forEach(prompt => {
      if (prompt.result === undefined) {
        prompt.result = null;
      }
    });

    // Explain why game was aborted
    switch (action.reason) {
      case AbortGameReason.TIME_ELAPSED:
        store.log(state, `Time elapsed for ${culprit.name}.`);
        break;
      case AbortGameReason.ILLEGAL_MOVES:
        store.log(state, culprit.name
          + ' made an invalid move multiple times'
          + ' and was banned by the arbiter.');
        break;
      case AbortGameReason.DISCONNECTED:
        store.log(state, `${culprit.name} has left the game.`);
        break;
    }

    // Game has not started, no winner
    if (state.phase === GamePhase.WAITING_FOR_PLAYERS || state.phase === GamePhase.SETUP) {
      store.log(state, 'Game finished before it has started.');
      state.phase = GamePhase.FINISHED;
      state.winner = GameWinner.NONE;
      return state;
    }

    // Let's decide who wins.
    const opponent = StateUtils.getOpponent(state, culprit);
    const culpritPrizeLeft = culprit.getPrizeLeft();
    const opponentPrizeLeft = opponent.getPrizeLeft();

    // It was first turn, no winner
    if (state.turn <= 2 && culpritPrizeLeft === opponentPrizeLeft) {
      state = endGame(store, state, GameWinner.NONE);
      return state;
    }

    // Opponent has same or less prizes, he wins
    if (opponentPrizeLeft <= culpritPrizeLeft) {
      const winner = opponent === state.players[0]
        ? GameWinner.PLAYER_1
        : GameWinner.PLAYER_2;
      state = endGame(store, state, winner);
      return state;
    }

    // Otherwise it's a draw
    state = endGame(store, state, GameWinner.DRAW);
  }

  return state;
}
