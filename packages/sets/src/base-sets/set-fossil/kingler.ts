import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Kingler extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Krabby';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Flail',
      cost: [CardType.WATER],
      damage: '10×',
      text: 'Does 10 damage times the number of damage counters on Kingler.'
    },
    {
      name: 'Crabhammer',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: '40',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Kingler';

  public fullName: string = 'Kingler FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
