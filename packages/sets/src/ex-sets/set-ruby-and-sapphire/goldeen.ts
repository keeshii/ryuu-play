import { AttackEffect, CardType, Effect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class Goldeen extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 50;

  public attacks = [
    {
      name: 'Flail',
      cost: [CardType.COLORLESS],
      damage: '10×',
      text: 'Does 10 damage for each damage counter on Goldeen.',
    },
  ];

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Goldeen';

  public fullName: string = 'Goldeen RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage = effect.player.active.damage;
      return state;
    }

    return state;
  }
}
