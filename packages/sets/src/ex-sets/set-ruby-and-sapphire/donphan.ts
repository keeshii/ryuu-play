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

export class Donphan extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Phanpy';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 80;

  public attacks = [
    {
      name: 'Rend',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: '20+',
      text: 'If the Defending Pokémon has any damage counters on it, this attack does 20 damage plus 20 more damage.',
    },
    {
      name: 'Double Spin',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '60×',
      text: 'Flip 2 coins. This attack does 60 damage times the number of heads.',
    },
  ];

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Donphan';

  public fullName: string = 'Donphan RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      effect.damage += opponent.active.damage ? 20 : 0;
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      return store.prompt(
        state,
        [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)],
        results => {
          let heads: number = 0;
          results.forEach(r => {
            heads += r ? 1 : 0;
          });
          effect.damage = 60 * heads;
        }
      );
    }

    return state;
  }
}
