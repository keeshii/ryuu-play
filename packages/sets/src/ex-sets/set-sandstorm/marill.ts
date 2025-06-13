import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Marill extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Double Bubble',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '10×',
      text:
        'Flip 2 coins. This attack does 10 damage times the number of heads. If either of the coins is heads, the ' +
        'Defending Pokémon is now Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Marill';

  public fullName: string = 'Marill SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
