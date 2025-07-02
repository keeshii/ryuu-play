import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  SpecialCondition,
  State,
  StoreLike,
} from '@ptcg/common';

import { CommonAttack } from '../common.interfaces';

export const flipSpecialConditions: CommonAttack<[SpecialCondition[]]> = function(
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {

  return {
    use: (attackEffect: AttackEffect, conditions: SpecialCondition[]) => {
      const player = attackEffect.player;

      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(attackEffect, conditions);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }
  };

};
