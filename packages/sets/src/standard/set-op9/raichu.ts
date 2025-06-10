import {
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Raichu extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pikachu';

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 90;

  public weakness = [{ type: CardType.FIGHTING, value: 20 }];

  public resistance = [{ type: CardType.METAL, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Slam',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '30×',
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.',
    },
    {
      name: 'High Voltage',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING],
      damage: '60',
      text: 'If Raichu evolved from Pikachu this turn, this attack\'s base damage is 100 instead of 60.',
    },
  ];

  public set: string = 'OP9';

  public name: string = 'Raichu';

  public fullName: string = 'Raichu OP9';

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
          effect.damage = 30 * heads;
        }
      );
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);
      if (!pokemonSlot) {
        return state;
      }
      if (pokemonSlot.pokemonPlayedTurn === state.turn) {
        effect.damage += 40;
      }
    }

    return state;
  }
}
