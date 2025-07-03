import {
  AttackEffect,
  CardType,
  CheckPokemonTypeEffect,
  Effect,
  EnergyType,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

import { commonAttacks } from '../../common';

export class Kecleon extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 60;

  public powers = [
    {
      name: 'Energy Variation',
      powerType: PowerType.POKEBODY,
      text: 'Kecleon\'s type is the same as every type of basic Energy card attached to Kecleon.'
    },
  ];

  public attacks = [
    {
      name: 'Double Scratch',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20×',
      text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Kecleon';

  public fullName: string = 'Kecleon SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipDamageTimes = commonAttacks.flipDamageTimes(this, store, state, effect);

    if (effect instanceof CheckPokemonTypeEffect && effect.target.pokemons.cards.includes(this)) {

      if (effect.target.getPokemonCard() !== this) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      const basicEnergies = effect.target.energies.cards.filter(c => c.energyType === EnergyType.BASIC);
      const energyTypes: CardType[] = [];
      for (const card of basicEnergies) {
        for (const energyType of card.provides) {
          if (!energyTypes.includes(energyType)) {
            energyTypes.push(energyType);
          }
        }
      }
      effect.cardTypes = energyTypes;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return flipDamageTimes.use(effect, 2, 20);
    }

    return state;
  }
}
