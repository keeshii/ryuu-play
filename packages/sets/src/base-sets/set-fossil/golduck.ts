import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Golduck extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Psyduck';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Psyshock',
      cost: [CardType.PSYCHIC],
      damage: '10',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Hyper Beam',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: '20',
      text: 'If the Defending Pokémon has any Energy cards attached to it, choose 1 of them and discard it.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Golduck';

  public fullName: string = 'Golduck FO';

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
