import {
  AttackEffect,
  ChoosePokemonPrompt,
  DealDamageEffect,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  SlotType,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

import { CommonAttack } from '../common.interfaces';

export const switchDamageFirst: CommonAttack<[boolean]> = function(
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {

  return {
    use: (attackEffect: AttackEffect, allowCancel: boolean) => {
      const player = attackEffect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = player.bench.some(b => b.pokemons.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel }
        ),
        targets => {
          if (targets && targets.length > 0) {
            if (attackEffect.damage > 0) {
              const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
              dealDamage.target = opponent.active;
              store.reduceEffect(state, dealDamage);
              attackEffect.damage = 0;
            }
            player.switchPokemon(targets[0]);
          }
        }
      );
    }
  };

};
