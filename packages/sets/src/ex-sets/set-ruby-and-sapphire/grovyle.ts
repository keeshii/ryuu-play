import { AttackEffect, CardType, Effect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class Grovyle extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Treecko';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public attacks = [
    {
      name: 'Poison Breath',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text: 'The Defending Pokémon is now Poisoned.',
    },
    {
      name: 'Swift',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text:
        'This attack\'s damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other ' +
        'effects on the Defending Pokémon.',
    },
  ];

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.WATER, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Grovyle';

  public fullName: string = 'Grovyle RS';

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
