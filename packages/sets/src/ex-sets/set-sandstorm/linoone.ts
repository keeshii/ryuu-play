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

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Sniff Out',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Put any 1 card from your discard pile into your hand.'
    },
    {
      name: 'Fury Swipes',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20×',
      text: 'Flip 3 coins. This attack does 20 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [];

  public set: string = 'SS';

  public name: string = 'Linoone';

  public fullName: string = 'Linoone SS';

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
