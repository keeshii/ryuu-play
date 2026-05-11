import {
  AbstractAttackEffect,
  AttackEffects,
  Effect,
  GamePhase,
  PokemonCard,
  Power,
  PowerEffect,
  State,
  StoreLike,
} from '@ptcg/common';

import { CommonPower } from '../common.interfaces';


export const protectiveDust: CommonPower = function(
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {
  return {
    reduce: (power: Power) => {
      if (effect instanceof AbstractAttackEffect && effect.target.pokemons.cards.includes(self)) {
        const player = effect.player;

        // pokemon is evolved
        if (effect.target.getPokemonCard() !== self) {
          return state;
        }

        // Not an attack
        if (state.phase !== GamePhase.ATTACK) {
          return state;
        }

        // Do not block effects that inflict damage
        const damageEffects: string[] = [
          AttackEffects.APPLY_WEAKNESS_EFFECT,
          AttackEffects.DEAL_DAMAGE_EFFECT,
          AttackEffects.PUT_DAMAGE_EFFECT,
          AttackEffects.AFTER_DAMAGE_EFFECT,
          // AttackEffects.PUT_COUNTERS_EFFECT, <-- This is not damage
        ];
        if (damageEffects.includes(effect.type)) {
          return state;
        }

        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(player, power, self);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }

        effect.preventDefault = true;
      }

      return state;
    }
  };
};
