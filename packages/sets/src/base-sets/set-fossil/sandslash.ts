import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Sandslash extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Sandshrew';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Slash',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
    {
      name: 'Fury Swipes',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: '20×',
      text: 'Flip 3 coins. This attack does 20 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public resistance = [
    { type: CardType.LIGHTNING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Sandslash';

  public fullName: string = 'Sandslash FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
