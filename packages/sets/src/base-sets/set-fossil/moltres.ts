import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Moltres extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Wildfire',
      cost: [CardType.FIRE],
      damage: '',
      text:
        'You may discard any number of R Energy cards attached to Moltres when you use this attack. If you do, ' +
        'discard that many cards from the top of your opponent\'s deck.'
    },
    {
      name: 'Dive Bomb',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE],
      damage: '80',
      text: 'Flip a coin. If tails, this attack does nothing.'
    },
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Moltres';

  public fullName: string = 'Moltres FO';

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
