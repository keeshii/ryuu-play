import {
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Vigoroth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Slakoth';

  public cardTypes: CardType[] = [CardType.COLORLESS];

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
      const player = effect.player;
      return store.prompt(
        state,
        [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        ],
        results => {
          let heads: number = 0;
          results.forEach(r => {
            heads += r ? 1 : 0;
          });
          effect.damage = 20 * heads;
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      effect.damage += effect.player.active.damage;
      return state;
    }

    return state;
  }
}
