import {
  CardType,
  CheckProvidedEnergyEffect,
  CheckRetreatCostEffect,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Zubat extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 40;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public powers = [
    {
      name: 'Free Flight',
      powerType: PowerType.ABILITY,
      text: 'If this Pokémon has no Energy attached to it, this Pokémon has no Retreat Cost.',
    },
  ];

  public attacks = [
    {
      name: 'Wing Attack',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '20',
      text: '',
    },
  ];

  public set: string = 'BW4';

  public name: string = 'Zubat';

  public fullName: string = 'Zubat PLS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      if (checkProvidedEnergy.energyMap.length === 0) {
        effect.cost = [];
      }
    }

    return state;
  }
}
