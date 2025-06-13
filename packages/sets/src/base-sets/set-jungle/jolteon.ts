import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Jolteon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 70;

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
      name: 'Pin Missile',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: '20×',
      text: 'Flip 4 coins. This attack does 20 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Jolteon';

  public fullName: string = 'Jolteon JU';

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
