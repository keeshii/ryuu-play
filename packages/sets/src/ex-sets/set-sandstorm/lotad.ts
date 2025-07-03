import {
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

export class Lotad extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 40;

  public powers = [
    {
      name: 'Rain Dish',
      powerType: PowerType.POKEBODY,
      text: 'At any time between turns, remove 1 damage counter from Lotad.'
    },
  ];

  public attacks = [
    {
      name: 'Ram',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Lotad';

  public fullName: string = 'Lotad SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
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

    return state;
  }
}
