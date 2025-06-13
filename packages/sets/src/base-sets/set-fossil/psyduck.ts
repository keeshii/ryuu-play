import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Psyduck extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Headache',
      cost: [CardType.PSYCHIC],
      damage: '',
      text: 'Your opponent can\'t play Trainer cards during his or her next turn.'
    },
    {
      name: 'Fury Swipes',
      cost: [CardType.WATER],
      damage: '10×',
      text: 'Flip 3 coins. This attack does 10 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Psyduck';

  public fullName: string = 'Psyduck FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
