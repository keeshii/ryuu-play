import {
  CardTarget,
  CheckHpEffect,
  DamageMap,
  Effect,
  GameError,
  GameMessage,
  MoveDamagePrompt,
  PlayerType,
  PokemonCard,
  Power,
  PowerEffect,
  SlotType,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

import { CommonPower } from '../common.interfaces';


export const strangeBehavior: CommonPower = function(
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {
  return {
    reduce: (power: Power) => {
      if (effect instanceof PowerEffect && effect.power === power) {
        const player = effect.player;

        const maxAllowedDamage: DamageMap[] = [];
        const blockedFrom: CardTarget[] = [];
        const blockedTo: CardTarget[] = [];
        let hasPokemonWithDamage = false;
        let hasSlowbroHpLeft = false;
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (pokemonSlot, pokemonCard, target) => {
          const checkHpEffect = new CheckHpEffect(player, pokemonSlot);
          store.reduceEffect(state, checkHpEffect);
          maxAllowedDamage.push({ target, damage: checkHpEffect.hp - 10 });
          if (pokemonCard === effect.card) {
            blockedFrom.push(target);
            if (pokemonSlot.damage < checkHpEffect.hp - 10) {
              hasSlowbroHpLeft = true;
            }
          } else {
            blockedTo.push(target);
            if (pokemonSlot.damage > 0) {
              hasPokemonWithDamage = true;
            }
          }
        });

        if (!hasSlowbroHpLeft || !hasPokemonWithDamage) {
          throw new GameError(GameMessage.CANNOT_USE_POWER);
        }

        return store.prompt(
          state,
          new MoveDamagePrompt(
            effect.player.id,
            GameMessage.MOVE_DAMAGE,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            maxAllowedDamage,
            { allowCancel: true, blockedFrom, blockedTo }
          ),
          transfers => {
            if (transfers === null) {
              return;
            }
            for (const transfer of transfers) {
              const source = StateUtils.getTarget(state, player, transfer.from);
              const target = StateUtils.getTarget(state, player, transfer.to);
              if (source.damage >= 10) {
                source.damage -= 10;
                target.damage += 10;
              }
            }
          }
        );
      }
      return state;
    }
  };
};
