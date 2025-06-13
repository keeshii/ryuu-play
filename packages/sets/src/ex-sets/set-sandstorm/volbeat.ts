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

export class Volbeat extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public powers = [
    {
      name: 'Uplifting Glow',
      powerType: PowerType.POKEBODY,
      text: 'As long as Illumise is in play, Volbeat\'s Retreat Cost is 0.'
    },
  ];

  public attacks = [
    {
      name: 'Toxic Vibration',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, the Defending Pokémon is now Poisoned. If tails, the Defending Pokémon is now ' +
        'Asleep.'
    },
    {
      name: 'Pester',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: '20+',
      text:
        'If the Defending Pokémon is affected by a Special Condition, this attack does 20 damage plus 20 more ' +
        'damage.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Volbeat';

  public fullName: string = 'Volbeat SS';

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
