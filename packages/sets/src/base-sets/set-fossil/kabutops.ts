import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Kabutops extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Kabuto';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Sharp Sickle',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: '30',
      text: ''
    },
    {
      name: 'Absorb',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING],
      damage: '40',
      text:
        'Remove a number of damage counters from Kabutops equal to half the damage done to the Defending Pokémon ' +
        '(after applying Weakness and Resistance) (rounded up to the nearest 10). If Kabutops has fewer damage ' +
        'counters than that, remove all of them.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Kabutops';

  public fullName: string = 'Kabutops FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
