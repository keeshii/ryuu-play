import { Action } from "../actions/action";
import { PassTurnAction, RetreatAction, AttackAction, UseAbilityAction, UseStadiumAction } from "../actions/game-actions";
import { State, GamePhase } from "../state/state";
import { StoreLike } from "../store-like";
import { GameError, GameMessage } from "../../game-error";
import { RetreatEffect, UseAttackEffect, UsePowerEffect, UseStadiumEffect } from "../effects/game-effects";
import { EndTurnEffect } from "../effects/game-phase-effects";
import { StateUtils } from "../state-utils";

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

    if (action instanceof UseAbilityAction) {
      const player = state.players[state.activePlayer];

      if (player === undefined || player.id !== action.clientId) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }

      const target = StateUtils.getTarget(state, player, action.target);
      const pokemonCard = target.getPokemonCard();
      if (pokemonCard === undefined) {
        throw new GameError(GameMessage.INVALID_TARGET);
      }

      const power = pokemonCard.powers.find(a => a.name === action.name);
      if (power === undefined) {
        throw new GameError(GameMessage.UNKNOWN_POWER);
      }

      state = store.reduceEffect(state, new UsePowerEffect(player, power, pokemonCard));
      return state;
    }

    if (action instanceof UseStadiumAction) {
      const player = state.players[state.activePlayer];

      if (player === undefined || player.id !== action.clientId) {
        throw new GameError(GameMessage.NOT_YOUR_TURN);
      }

      if (player.stadiumUsedTurn === state.turn) {
        throw new GameError(GameMessage.STADIUM_ALREADY_USED);
      }

      const stadium = StateUtils.getStadiumCard(state);
      if (stadium === undefined) {
        throw new GameError(GameMessage.NO_STADIUM_IN_PLAY);
      }

      state = store.reduceEffect(state, new UseStadiumEffect(player, stadium));
      return state;
    }

  }

  return state;
}
