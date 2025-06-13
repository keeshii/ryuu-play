import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Omastar extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Omanyte';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Water Gun',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '20+',
      text:
        'Does 20 damage plus 10 more damage for each W Energy attached to Omastar but not used to pay for this ' +
        'attack\'s Energy cost. You can\'t add more than 20 damage in this way.'
    },
    {
      name: 'Spike Cannon',
      cost: [CardType.WATER, CardType.WATER],
      damage: '30×',
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Omastar';

  public fullName: string = 'Omastar FO';

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
