import { AttackEffect, CardType, Effect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class Joltik extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 30;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.METAL, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Gnaw',
      cost: [CardType.LIGHTNING],
      damage: '10',
      text: '',
    },
    {
      name: 'Night March',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20×',
      text:
        'This attack does 20 damage times the number of Pokémon ' +
        'in your discard pile that have the Night March attack.',
    },
  ];

  public set: string = 'BW3';

  public name: string = 'Joltik';

  public fullName: string = 'Joltik PFO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      let pokemonCount = 0;
      player.discard.cards.forEach(c => {
        if (c instanceof PokemonCard && c.attacks.some(a => a.name === 'Night March')) {
          pokemonCount += 1;
        }
      });

      effect.damage = pokemonCount * 20;
    }

    return state;
  }
}
