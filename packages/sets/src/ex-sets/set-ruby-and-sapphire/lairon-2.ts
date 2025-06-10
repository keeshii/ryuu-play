import {
  AttackEffect,
  CardType,
  CoinFlipPrompt,
  Effect,
  GameMessage,
  PokemonCard,
  PutDamageEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Lairon2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Aron';

  public cardTypes: CardType[] = [CardType.METAL];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Magnitude',
      cost: [CardType.METAL],
      damage: '20',
      text:
        'Does 10 damage to each Benched Pokémon (both yours and your opponent\'s). (Don\'t apply Weakness and ' +
        'Resistance for Benched Pokémon.)',
    },
    {
      name: 'One-Two Strike',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30+',
      text: 'Flip 2 coins. This attack does 30 damage plus 20 more damage for each heads.',
    },
  ];

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Lairon';

  public fullName: string = 'Lairon RS-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.bench.forEach(benched => {
        if (benched.pokemons.cards.length > 0) {
          const dealDamage = new PutDamageEffect(effect, 10);
          dealDamage.target = benched;
          store.reduceEffect(state, dealDamage);
        }
      });

      opponent.bench.forEach(benched => {
        if (benched.pokemons.cards.length > 0) {
          const dealDamage = new PutDamageEffect(effect, 10);
          dealDamage.target = benched;
          store.reduceEffect(state, dealDamage);
        }
      });
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
          effect.damage += 20 * heads;
        }
      );
    }

    return state;
  }
}
