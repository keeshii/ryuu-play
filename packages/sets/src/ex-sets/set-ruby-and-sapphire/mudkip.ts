import { AttackEffect, CardType, Effect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class Mudkip extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 50;

  public attacks = [
    {
      name: 'Bubble',
      cost: [CardType.WATER],
      damage: '10',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.',
    },
  ];

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Mudkip';

  public fullName: string = 'Mudkip RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
