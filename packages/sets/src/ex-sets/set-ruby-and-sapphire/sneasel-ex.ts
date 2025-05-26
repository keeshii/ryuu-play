import {
  AttackEffect,
  CardTag,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PlayerType,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class SneaselEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 80;

  public attacks = [
    {
      name: 'Double Scratch',
      cost: [CardType.DARK],
      damage: '10×',
      text: 'Flip 2 coins. This attack does 10 damage times the number of heads.',
    },
    {
      name: 'Beat Up',
      cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS],
      damage: '20×',
      text:
        'Flip a coin for each of your Pokémon in play (including Sneasel ex). This attack does 20 damage times the ' +
        'number of heads.',
    },
  ];

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Sneasel ex';

  public fullName: string = 'Sneasel ex RS';

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

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const coinFlipPrompts: CoinFlipPrompt[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        coinFlipPrompts.push(new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP));
      });

      return store.prompt(state, coinFlipPrompts, results => {
        let heads: number = 0;
        results.forEach(r => {
          heads += r ? 1 : 0;
        });
        effect.damage = 20 * heads;
      });
    }

    return state;
  }
}
