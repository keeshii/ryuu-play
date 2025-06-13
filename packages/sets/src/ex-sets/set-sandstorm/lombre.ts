import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Lombre extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Lotad';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Surprise',
      cost: [CardType.COLORLESS],
      damage: '10',
      text:
        'Choose 1 card from your opponent\'s hand without looking. Look at the card you chose, then have your ' +
        'opponent shuffle that card into his or her deck.'
    },
    {
      name: 'Fury Swipes',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20×',
      text: 'Flip 3 coins. This attack does 20 damages times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Lombre';

  public fullName: string = 'Lombre SS';

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
