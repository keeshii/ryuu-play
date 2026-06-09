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

export class DarkHypno extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Drowzee';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Psypunch',
      cost: [CardType.PSYCHIC],
      damage: '20',
      text: ''
    },
    {
      name: 'Bench Manipulation',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: '20×',
      text:
        'Your opponent flips a number of coins equal to the number of Pokémon on his or her Bench. This attack does ' +
        '20 damage times the number of tails. Don\'t apply Weakness and Resistance for this attack. (Any other ' +
        'effects that would happen after applying Weakness and Resistance still happen.)'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'TR';

  public name: string = 'Dark Hypno';

  public fullName: string = 'Dark Hypno TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const benched = opponent.bench.reduce((left, b) => left + (b.pokemons.cards.length ? 1 : 0), 0);

      if (benched === 0) {
        effect.damage = 0;
        return state;
      }

      effect.ignoreResistance = true;
      effect.ignoreWeakness = true;

      const coinFlipPrompts: CoinFlipPrompt[] = [];
      for (let i = 0; i < benched; i++) {
        coinFlipPrompts.push(new CoinFlipPrompt(opponent.id, GameMessage.COIN_FLIP));
      }

      return store.prompt(
        state,
        coinFlipPrompts,
        results => {
          let tails: number = 0;
          results.forEach(r => {
            tails += r ? 0 : 1;
          });
          effect.damage = 20 * tails;
        }
      );
    }

    return state;
  }
}
