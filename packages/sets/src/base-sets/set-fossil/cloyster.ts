import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Cloyster extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Shellder';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Clamp',
      cost: [CardType.WATER, CardType.WATER],
      damage: '30',
      text:
        'Flip a coin. If heads, the Defending Pokémon is now Paralyzed. If tails, this attack does nothing (not ' +
        'even damage).'
    },
    {
      name: 'Spike Cannon',
      cost: [CardType.WATER, CardType.WATER],
      damage: '30×',
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Cloyster';

  public fullName: string = 'Cloyster FO';

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
