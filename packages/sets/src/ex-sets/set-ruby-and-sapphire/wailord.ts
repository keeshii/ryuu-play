import { AttackEffect, CardType, Effect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class Wailord extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Wailmer';

  public cardType: CardType = CardType.WATER;

  public hp: number = 120;

  public attacks = [
    {
      name: 'Take Down',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: 'Wailord does 20 damage to itself.',
    },
    {
      name: 'Surf',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '70',
      text: '',
    },
  ];

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Wailord';

  public fullName: string = 'Wailord RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
