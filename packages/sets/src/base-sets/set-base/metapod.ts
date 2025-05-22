import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Metapod extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Caterpie';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public attacks = [
    {
      name: 'Stiffen',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, prevent all damage done to Metapod during your opponent\'s next turn. (Any other ' +
        'effects of attacks still happen.) '
    },
    {
      name: 'Stun Spore',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Metapod';

  public fullName: string = 'Metapod BS';

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
