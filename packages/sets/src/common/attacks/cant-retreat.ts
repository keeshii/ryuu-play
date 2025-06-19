import {
  AddMarkerEffect,
  AttackEffect,
  Effect,
  EndTurnEffect,
  GameError,
  GameMessage,
  PokemonCard,
  RetreatEffect,
  State,
  StoreLike,
} from '@ptcg/common';

import { CommonAttack } from '../common.interfaces';

const CANT_RETREAT_MARKER = 'CANT_RETREAT_MARKER';

export const cantRetreat: CommonAttack = function(
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {

  function reduceEffect() {

    // Block retreat for opponent's Pokemon with marker.
    if (effect instanceof RetreatEffect) {
      const player = effect.player;

      const hasMarker = player.active.marker.hasMarker(CANT_RETREAT_MARKER, self);
      if (!hasMarker) {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(CANT_RETREAT_MARKER, self);
    }

    return state;
  }

  state = reduceEffect();

  return {
    use: (attackEffect: AttackEffect) => {
      const addMarkerEffect = new AddMarkerEffect(attackEffect, CANT_RETREAT_MARKER, self);
      return store.reduceEffect(state, addMarkerEffect);
    }
  };

};
