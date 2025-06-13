import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Lileep2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Root Fossil';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Amnesia',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Choose 1 of the Defending Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s ' +
        'next turn.'
    },
    {
      name: 'Headbutt',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Lileep';

  public fullName: string = 'Lileep SS-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
