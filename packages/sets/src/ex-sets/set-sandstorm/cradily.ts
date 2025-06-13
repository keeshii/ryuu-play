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

export class Cradily extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Lileep';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 100;

  public powers = [
    {
      name: 'Super Suction Cups',
      powerType: PowerType.POKEBODY,
      text: 'As long as Cradily is your Active Pokémon, your opponent\'s Pokémon can\'t retreat.'
    },
  ];

  public attacks = [
    {
      name: 'Lure Poison',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Before using this effect, you may switch the Defending Pokémon with 1 of your opponent\'s Benched Pokémon, ' +
        'if any. The Defending Pokémon is now Poisoned.'
    },
    {
      name: 'Spiral Drain',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: 'Remove 2 damage counters from Cradily (remove 1 if there is only 1).'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Cradily';

  public fullName: string = 'Cradily SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
