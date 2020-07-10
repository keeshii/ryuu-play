import { GameError, GameMessage } from "../../game-error";
import { Effect } from "../effects/effect";
import { State, GamePhase, GameWinner } from "../state/state";
import { StoreLike } from "../store-like";
import { Player } from "../state/player";
import { EndTurnEffect, EndGameEffect } from "../effects/game-phase-effects";
import { checkState } from "./check-state-effect";
import {GameOverPrompt} from "../prompts/game-over-prompt";

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
    state = store.reduceEffect(state, new EndGameEffect(winner));
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
      store.log(state, `${player.name} ends the turn.`);
      state = betweenTurns(store, state);
      state = nextTurn(store, state);
    });

    return state;
  }

  if (effect instanceof EndGameEffect) {
    const winner = effect.winner;

    if (state.players.length !== 2) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    switch (winner) {
      case GameWinner.NONE:
        store.log(state, 'Game finished.');
        break;
      case GameWinner.DRAW:
        store.log(state, 'Game finished. It\'s a draw.');
        break;
      case GameWinner.PLAYER_1:
      case GameWinner.PLAYER_2:
        const winnerName = winner === GameWinner.PLAYER_1
          ? state.players[0].name
          : state.players[1].name;
        store.log(state, `Game finished. Winner ${winnerName}.`);
        break;
    }

    state = store.prompt(state, [
      new GameOverPrompt(state.players[0].id, winner),
      new GameOverPrompt(state.players[1].id, winner),
    ], () => {
      state.winner = winner;
      state.phase = GamePhase.FINISHED;
    });

    return state;
  }

  return state;
}
