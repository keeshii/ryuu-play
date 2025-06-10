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

export class Riolu extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 70;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Double Smash',
      cost: [CardType.COLORLESS],
      damage: '10×',
      text: 'Flip 2 coins. This attack does 10 damage times the number of heads.',
    },
  ];

  public set: string = 'BW4';

  public name: string = 'Riolu';

  public fullName: string = 'Riolu FCO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(
        state,
        [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)],
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
