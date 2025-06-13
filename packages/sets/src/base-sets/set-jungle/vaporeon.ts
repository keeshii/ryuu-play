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

  public hp: number = 80;

  public attacks = [
    {
      name: 'Quick Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '10+',
      text:
        'Flip a coin. If heads, this attack does 10 damage plus 20 more damage; if tails, this attack does 10 ' +
        'damage.'
    },
    {
      name: 'Water Gun',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: '30+',
      text:
        'Does 30 damage plus 10 more damage for each W Energy attached to Vaporeon but not used to pay for this ' +
        'attack\'s Energy cost. Extra W Energy after the 2nd doesn\'t count.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Vaporeon';

  public fullName: string = 'Vaporeon JU';

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
