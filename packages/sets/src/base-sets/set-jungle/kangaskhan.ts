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

export class Kangaskhan extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 90;

  public attacks = [
    {
      name: 'Fetch',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'Draw a card.'
    },
    {
      name: 'Comet Punch',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '20×',
      text: 'Flip 4 coins. This attack does 20 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Kangaskhan';

  public fullName: string = 'Kangaskhan JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      player.deck.moveTo(player.hand, 1);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      return store.prompt(
        state,
        [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
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

    return state;
  }
}
