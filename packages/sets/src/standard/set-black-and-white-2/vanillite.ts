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

export class Vanillite extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 50;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Icicle Barb',
      cost: [CardType.WATER],
      damage: '10+',
      text: 'Flip a coin. If heads, this attack does 10 more damage.',
    },
  ];

  public set: string = 'BW2';

  public name: string = 'Vanillite';

  public fullName: string = 'Vanillite NV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)], result => {
        if (result) {
          effect.damage += 10;
        }
      });
    }

    return state;
  }
}
