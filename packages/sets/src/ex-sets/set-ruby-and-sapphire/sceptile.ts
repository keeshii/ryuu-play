import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Sceptile extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Grovyle';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 120;

  public attacks = [
    {
      name: 'Lizard Poison',
      cost: [CardType.COLORLESS],
      damage: '20',
      text:
        'If 1 Energy is attached to Sceptile, the Defending Pokémon is now Asleep. If 2 Energy is attached to ' +
        'Sceptile, the Defending Pokémon is now Poisoned. If 3 Energy is attached to Sceptile, the Defending ' +
        'Pokémon is now Asleep and Poisoned. If 4 or more Energy is attached to Sceptile, the Defending Pokémon is ' +
        'now Asleep, Burned, and Poisoned. '
    },
    {
      name: 'Solarbeam',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '70',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public resistance = [
    { type: CardType.WATER, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Sceptile';

  public fullName: string = 'Sceptile RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
