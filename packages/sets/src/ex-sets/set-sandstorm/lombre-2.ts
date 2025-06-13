import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Lombre2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Lotad';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 60;

  public powers = [
    {
      name: 'Rain Dish',
      powerType: PowerType.POKEBODY,
      text: 'At any time between turns, remove 1 damage counter from Lombre.'
    },
  ];

  public attacks = [
    {
      name: 'Double Scratch',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '30×',
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Lombre';

  public fullName: string = 'Lombre SS-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
