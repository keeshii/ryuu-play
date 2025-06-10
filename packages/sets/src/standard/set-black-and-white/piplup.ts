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

export class Piplup extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 60;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Fury Attack',
      cost: [CardType.WATER],
      damage: '10×',
      text: 'Flip 3 coins. This attack does 10 damage times the number of heads.',
    },
  ];

  public set: string = 'BW';

  public name: string = 'Piplup';

  public fullName: string = 'Piplup DEX';

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
          effect.damage = 10 * heads;
        }
      );
    }

    return state;
  }
}
