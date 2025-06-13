import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Golbat extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Zubat';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Wing Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
    {
      name: 'Leech Life',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: '20',
      text:
        'Remove a number of damage counters from Golbat equal to the damage done to the Defending Pokémon (after ' +
        'applying Weakness and Resistance). If Golbat has fewer damage counters than that, remove all of them.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'FO';

  public name: string = 'Golbat';

  public fullName: string = 'Golbat FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
