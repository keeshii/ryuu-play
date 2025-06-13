import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Spearow extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Super Speed',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Spearow during your ' +
        'opponent\'s next turn.'
    },
    {
      name: 'Peck',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Spearow';

  public fullName: string = 'Spearow SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
