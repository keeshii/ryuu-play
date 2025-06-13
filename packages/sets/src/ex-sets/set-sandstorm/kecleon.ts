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
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
