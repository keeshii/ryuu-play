import {
  Attack,
  AttackEffect,
  ChooseAttackPrompt,
  Effect,
  GameLog,
  GameMessage,
  PokemonCard,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

import { CommonAttack } from '../common.interfaces';

export const metronome: CommonAttack = function(
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {

  return {
    use: (attackEffect: AttackEffect) => {
      const player = attackEffect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Choose an opponent's Pokemon attack
      const pokemonCard = opponent.active.getPokemonCard();
      if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
        return state;
      }

      return store.prompt(
        state,
        new ChooseAttackPrompt(player.id, GameMessage.CHOOSE_ATTACK_TO_COPY, [pokemonCard], {
          allowCancel: true,
        }),
        result => {
          if (result !== null) {
            const attack = result as Attack;
            store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, { name: player.name, attack: attack.name });
            const copiedAttackEffect = new AttackEffect(player, opponent, attack);
            store.reduceEffect(state, copiedAttackEffect);
            store.waitPrompt(state, () => {
              attackEffect.damage = copiedAttackEffect.damage;
            });
          }
        }
      );
    }
  };

};
