import {
  AttackEffect,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  State,
  StoreLike,
} from '@ptcg/common';

import { CommonAttack } from '../common.interfaces';

export const flipDamageTimes: CommonAttack<[number, number]> = function(
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {

  return {
    use: (attackEffect: AttackEffect, times: number, damage: number) => {
      const player = attackEffect.player;

      const coinFlipPrompts: CoinFlipPrompt[] = [];
      for (let i = 0; i < times; i++) {
        coinFlipPrompts.push(new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP));
      }

      return store.prompt(
        state,
        coinFlipPrompts,
        results => {
          let heads: number = 0;
          results.forEach(r => {
            heads += r ? 1 : 0;
          });
          attackEffect.damage = damage * heads;
        }
      );
    }
  };

};
