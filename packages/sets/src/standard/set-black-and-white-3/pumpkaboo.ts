import { AttackEffect, CardType, Effect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class Pumpkaboo extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Ram',
      cost: [CardType.PSYCHIC],
      damage: '10',
      text: '',
    },
    {
      name: 'Night March',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '20×',
      text:
        'This attack does 20 damage times the number of Pokémon ' +
        'in your discard pile that have the Night March attack.',
    },
  ];

  public set: string = 'BW3';

  public name: string = 'Pumpkaboo';

  public fullName: string = 'Pumpkaboo PFO';

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
