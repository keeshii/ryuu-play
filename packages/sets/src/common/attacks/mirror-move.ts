import {
  AfterDamageEffect,
  AttackEffect,
  Effect,
  EndTurnEffect,
  GamePhase,
  PokemonCard,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

import { CommonAttack } from '../common.interfaces';


const MIRROR_MOVE_DAMAGE_MARKER = 'MIRROR_MOVE_DAMAGE_MARKER_{damage}';

export const mirrorMove: CommonAttack = function(
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {

  function reduceEffect() {
    // Remember damage done to Pidgeotto by the opponent's attacks
    if (effect instanceof AfterDamageEffect && effect.target.pokemons.cards.includes(self)) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      // No damage, or damage done by itself, or Pidgeotto is not active
      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
        return state;
      }

      // Pokemon is evolved, Not an attack
      if (effect.target.getPokemonCard() !== self || state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const markerName = MIRROR_MOVE_DAMAGE_MARKER.replace('{damage}', String(effect.damage));
      effect.target.marker.addMarker(markerName, self);
    }

    // Clear damage markers
    if (effect instanceof EndTurnEffect) {
      const markers = effect.player.active.marker.markers.filter(c => c.source === self);
      for (const marker of markers) {
        effect.player.active.marker.removeMarker(marker.name, marker.source);
      }
    }
    
    return state;
  }

  state = reduceEffect();

  return {
    use: (attackEffect: AttackEffect) => {
      // As far I know there is an errata for this attack, and it copies damage only
      // CC: Mirror Move:
      // If Pidgeot was damaged by an attack during your opponent's last turn,
      // this attack dose the same amount of damage done to Pidgeot to the Defending Pokemon.
      const player = attackEffect.player;
      const marker = player.active.marker.markers.find(c => c.source === self);

      if (!marker) {
        return state;
      }

      const damage = parseInt(marker.name.replace(/\D/g, ''), 10);
      if (damage > 0) {
        attackEffect.damage = damage;
      }

      return state;
    }
  };

};
