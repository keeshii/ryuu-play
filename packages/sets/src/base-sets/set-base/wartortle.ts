import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Wartortle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Squirtle';

  public cardType: CardType = CardType.WATER;

  public hp: number = 70;

  public attacks = [
    {
      name: 'Withdraw',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, prevent all damage done to Wartortle during your opponent\'s next turn. (Any other ' +
        'effects of attacks still happen.) '
    },
    {
      name: 'Bite',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Wartortle';

  public fullName: string = 'Wartortle BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
