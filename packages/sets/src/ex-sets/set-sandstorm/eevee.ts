import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Eevee extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Signs of Evolution',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for up to 3 cards that evolve from Eevee, show them to your opponent, and put them into ' +
        'your hand. Shuffle your deck afterward.'
    },
    {
      name: 'Quick Attack',
      cost: [CardType.COLORLESS],
      damage: '10+',
      text: 'Flip a coin. If heads, this attack does 10 damage plus 10 more damage.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Eevee';

  public fullName: string = 'Eevee SS';

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
