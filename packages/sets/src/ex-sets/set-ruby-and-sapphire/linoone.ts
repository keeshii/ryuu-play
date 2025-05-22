import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Linoone extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Zigzagoon';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 70;

  public attacks = [
    {
      name: 'Seek Out',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Search your deck for up to 2 cards and put them into your hand. Shuffle your deck afterward.'
    },
    {
      name: 'Continuous Headbutt',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '40×',
      text: 'Flip a coin until you get tails. This attack does 40 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Linoone';

  public fullName: string = 'Linoone RS';

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
