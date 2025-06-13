import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Cyndaquil extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Tackle',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
    {
      name: 'Singe',
      cost: [CardType.FIRE],
      damage: '',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Burned.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Cyndaquil';

  public fullName: string = 'Cyndaquil SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
