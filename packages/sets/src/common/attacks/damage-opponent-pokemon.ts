import {
  AttackEffect,
  ChoosePokemonOptions,
  ChoosePokemonPrompt,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  PutDamageEffect,
  SlotType,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

import { CommonAttack } from '../common.interfaces';

export const damageOpponentPokemon: CommonAttack<[damage: number, slotTypes?: SlotType[], options?: Partial<ChoosePokemonOptions>]> = function(
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {

  return {
    use: (
      attackEffect: AttackEffect,
      damage: number,
      slotTypes: SlotType[] = [SlotType.ACTIVE, SlotType.BENCH],
      options: Partial<ChoosePokemonOptions> = {}
    ) => {
      const player = attackEffect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          slotTypes,
          { allowCancel: false, ...options }
        ),
        selected => {
          const targets = selected || [];
          if (targets.includes(opponent.active)) {
            attackEffect.damage = damage;
            return;
          }
          targets.forEach(target => {
            const damageEffect = new PutDamageEffect(attackEffect, damage);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          });
        }
      );
    }
  };

};
