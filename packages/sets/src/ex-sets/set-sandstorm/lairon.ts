import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Lairon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Aron';

  public cardTypes: CardType[] = [CardType.METAL];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Iron Defense',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Lairon during your ' +
        'opponent\'s next turn.'
    },
    {
      name: 'Headbutt',
      cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public resistance = [
    { type: CardType.GRASS, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Lairon';

  public fullName: string = 'Lairon SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
