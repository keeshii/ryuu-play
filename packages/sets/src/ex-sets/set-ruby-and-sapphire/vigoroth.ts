import { AttackEffect, CardType, Effect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class Vigoroth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Slakoth';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 70;

  public attacks = [
    {
      name: 'Fury Swipes',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20×',
      text: 'Flip 3 coins. This attack does 20 damage times the number of heads.',
    },
    {
      name: 'Rage',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '20+',
      text: 'Does 20 damage plus 10 more damage for each damage counter on Vigoroth.',
    },
  ];

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Vigoroth';

  public fullName: string = 'Vigoroth RS';

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
