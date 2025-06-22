import {
  AttackEffect,
  CoinFlipPrompt,
  Effect,
  EndTurnEffect,
  GameMessage,
  PokemonCard,
  State,
  StateUtils,
  StoreLike,
  UseAttackEffect,
} from '@ptcg/common';

import { CommonAttack } from '../common.interfaces';

const SMOKESCREEN_MARKER = 'SMOKESCREEN_MARKER';

export const smokescreen: CommonAttack = function(
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {

  function reduceEffect() {
    if (effect instanceof UseAttackEffect && effect.player.active.marker.hasMarker(SMOKESCREEN_MARKER, self)) {
      const player = effect.player;
      effect.preventDefault = true;
      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        player.active.marker.removeMarker(SMOKESCREEN_MARKER);
        const attackEffect = result ? new UseAttackEffect(player, effect.attack) : new EndTurnEffect(player);
        store.reduceEffect(state, attackEffect);
      });
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(SMOKESCREEN_MARKER);
    }

    return state;
  }

  state = reduceEffect();

  return {
    use: (attackEffect: AttackEffect) => {
      const player = attackEffect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(SMOKESCREEN_MARKER, self);
      return state;
    }
  };

};
