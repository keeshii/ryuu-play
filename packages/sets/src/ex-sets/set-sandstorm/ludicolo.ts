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

export class Ludicolo extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Lombre';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 90;

  public powers = [
    {
      name: 'Rain Dish',
      powerType: PowerType.POKEBODY,
      text: 'At any time between turns, remove 1 damage counter from Ludicolo.'
    },
  ];

  public attacks = [
    {
      name: 'Hydro Punch',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50+',
      text:
        'Does 50 damage plus 10 more damage for each W Energy attached to Ludicolo but not used to pay for this ' +
        'attack\'s Energy cost. You can\'t add more than 20 damage in this way.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Ludicolo';

  public fullName: string = 'Ludicolo SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const additionalEnergyDamage = commonAttacks.additionalEnergyDamage(this, store, state, effect);

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
      return additionalEnergyDamage.use(effect, CardType.WATER, 10, 2);
    }

    return state;
  }
}
