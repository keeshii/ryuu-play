import { Action } from "../actions/action";
import { PassTurnAction, RetreatAction, AttackAction } from "../actions/game-actions";
import { Player } from "../state/player";
import { State, GamePhase } from "../state/state";
import { StoreLike } from "../store-like";
import { GameError, GameMessage } from "../../game-error";
import { RetreatEffect, UseAttackEffect } from "../effects/game-effects";
import {EndTurnEffect} from "../effects/game-phase-effects";

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
    store.log(state, `${player.name} has no more cards in the deck. Game finished.`);
    state.winner = state.activePlayer ? 0 : 1;
    store.log(state, `Winner ${state.players[state.winner].name}.`);
    state.phase = GamePhase.FINISHED;
    return state;
  }

  player.deck.moveTo(player.hand, 1);
  return state;
}

export function playerTurnReducer(store: StoreLike, state: State, action: Action): State {

  if (state.phase === GamePhase.PLAYER_TURN) {

    if (action instanceof PassTurnAction) {
      const player = state.players[state.activePlayer];

      if (player === undefined || player.id !== action.clientId) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }

      const endTurnEffect = new EndTurnEffect(player);

      state = store.reduceEffect(state, endTurnEffect);
      return state;
    }

    if (action instanceof RetreatAction) {
      const player = state.players[state.activePlayer];

      if (player === undefined || player.id !== action.clientId) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }

      const retreatEffect = new RetreatEffect(player, action.benchIndex);
      state = store.reduceEffect(state, retreatEffect);
      return state;
    }

    if (action instanceof AttackAction) {
      const player = state.players[state.activePlayer];

      if (player === undefined || player.id !== action.clientId) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }

      const pokemonCard = player.active.getPokemonCard();
      if (pokemonCard === undefined) {
        throw new GameError(GameMessage.UNKNOWN_ATTACK);
      }

      const attack = pokemonCard.attacks.find(a => a.name === action.name);
      if (attack === undefined) {
        throw new GameError(GameMessage.UNKNOWN_ATTACK);
      }

      const useAttackEffect = new UseAttackEffect(player, attack);
      state = store.reduceEffect(state, useAttackEffect);
      return state;
    }

  }

  return state;
}
