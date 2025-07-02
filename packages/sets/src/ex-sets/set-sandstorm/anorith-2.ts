import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

import { commonAttacks } from '../../common';

export class Anorith2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Claw Fossil';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Slash',
      cost: [CardType.FIGHTING],
      damage: '20',
      text: ''
    },
    {
      name: 'Double Scratch',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40×',
      text: 'Flip 2 coins. This attack does 40 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Anorith';

  public fullName: string = 'Anorith SS-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    const flipDamageTimes = commonAttacks.flipDamageTimes(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return flipDamageTimes.use(effect, 2, 40);
    }

    return state;
  }
}
