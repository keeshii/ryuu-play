import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Paras extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Scratch',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
    {
      name: 'Spore',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '',
      text: 'The Defending Pokémon is now Asleep.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Paras';

  public fullName: string = 'Paras JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
