import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Skitty extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Energy Catch',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Search your discard pile for a basic Energy card, show it to your opponent, and put it into your hand.'
    },
    {
      name: 'Double-edge',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: 'Skitty does 10 damage to itself.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Skitty';

  public fullName: string = 'Skitty SS';

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
