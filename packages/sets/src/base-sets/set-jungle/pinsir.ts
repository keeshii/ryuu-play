import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Pinsir extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Irongrip',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Guillotine',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Pinsir';

  public fullName: string = 'Pinsir JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
