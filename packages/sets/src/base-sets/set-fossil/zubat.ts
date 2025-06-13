import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Zubat extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Supersonic',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    },
    {
      name: 'Leech Life',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: '10',
      text:
        'Remove a number of damage counters from Zubat equal to the damage done to the Defending Pokémon (after ' +
        'applying Weakness and Resistance). If Zubat has fewer damage counters than that, remove all of them.'
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

  public name: string = 'Zubat';

  public fullName: string = 'Zubat FO';

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
