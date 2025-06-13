import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Arbok extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Ekans';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 70;

  public powers = [
    {
      name: 'Intimidating Fang',
      powerType: PowerType.POKEBODY,
      text:
        'As long as Arbok is your Active Pokémon, any damage done to your Pokémon by an opponent\'s attack is ' +
        'reduced by 10 (before applying Weakness and Resistance).'
    },
  ];

  public attacks = [
    {
      name: 'Toxic',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text:
        'The Defending Pokémon is now Poisoned. Put 2 damage counters instead of 1 on the Defending Pokémon between ' +
        'turns.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Arbok';

  public fullName: string = 'Arbok SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
