import { AttackEffect, CardType, Effect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class Manectric extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Electrike';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 70;

  public attacks = [
    {
      name: 'Attract Current',
      cost: [CardType.COLORLESS],
      damage: '10',
      text:
        'Search your deck for a Lightning Energy card and attach it to 1 of your Pokémon. Shuffle your deck ' +
        'afterward.',
    },
    {
      name: 'Thunder Jolt',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: '50',
      text: 'Flip a coin. If tails, Manectric does 10 damage to itself.',
    },
  ];

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.METAL, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Manectric';

  public fullName: string = 'Manectric RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
