import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Vaporeon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Aurora Beam',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
    {
      name: 'Aqua Sonic',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: 'This attack\'s damage is not affected by Resistance.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Vaporeon';

  public fullName: string = 'Vaporeon SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      effect.ignoreResistance = true;
      return state;
    }

    return state;
  }
}
