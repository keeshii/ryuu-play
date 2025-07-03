import {
  AttackEffect,
  BetweenTurnsEffect,
  CardType,
  Effect,
  HealEffect,
  PlayerType,
  PokemonCard,
  PokemonSlot,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

import { commonAttacks } from '../../common';

export class Lombre2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Lotad';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 60;

  public powers = [
    {
      name: 'Rain Dish',
      powerType: PowerType.POKEBODY,
      text: 'At any time between turns, remove 1 damage counter from Lombre.'
    },
  ];

  public attacks = [
    {
      name: 'Double Scratch',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '30×',
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Lombre';

  public fullName: string = 'Lombre SS-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipDamageTimes = commonAttacks.flipDamageTimes(this, store, state, effect);

    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let targetPlayer = player;
      let target: PokemonSlot | undefined;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (slot, pokemonCard) => {
        if (pokemonCard === this && slot.damage >= 10) {
          targetPlayer = player;
          target = slot;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (slot, pokemonCard) => {
        if (pokemonCard === this && slot.damage >= 10) {
          targetPlayer = opponent;
          target = slot;
        }
      });

      if (!target) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      const healEffect = new HealEffect(targetPlayer, target, 10);
      store.reduceEffect(state, healEffect);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return flipDamageTimes.use(effect, 2, 30);
    }

    return state;
  }
}
