import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Makuhita2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 50;

  public attacks = [
    {
      name: 'Fling',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
    },
    {
      name: 'Low Kick',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Makuhita';

  public fullName: string = 'Makuhita RS-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
