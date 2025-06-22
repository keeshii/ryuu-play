import {
  AttackEffect,
  CardType,
  CheckAttackCostEffect,
  CheckProvidedEnergyEffect,
  Effect,
  PokemonCard,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

import { CommonAttack } from '../common.interfaces';

export const additionalEnergyDamage: CommonAttack<[CardType, number, number]> = function(
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {

  return {
    use: (attackEffect: AttackEffect, cardType: CardType, damage: number, max: number) => {
      const player = attackEffect.player;

      const checkAttackCost = new CheckAttackCostEffect(player, attackEffect.attack);
      state = store.reduceEffect(state, checkAttackCost);
      const attackCost = checkAttackCost.cost;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const provided =  checkProvidedEnergyEffect.energyMap;
      const energyCount = StateUtils.countAdditionalEnergy(provided, attackCost, cardType);

      attackEffect.damage += Math.min(energyCount, max) * damage;
      return state;
    }
  };

};
