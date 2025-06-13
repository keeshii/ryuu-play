import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Scyther extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Swords Dance',
      cost: [CardType.GRASS],
      damage: '',
      text: 'During your next turn, Scyther\'s Slash attack\'s base damage is 60 instead of 30.'
    },
    {
      name: 'Slash',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'JU';

  public name: string = 'Scyther';

  public fullName: string = 'Scyther JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
