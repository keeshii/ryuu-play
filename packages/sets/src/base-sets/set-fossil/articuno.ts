import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Articuno extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Freeze Dry',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER],
      damage: '30',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Blizzard',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER, CardType.WATER],
      damage: '50',
      text:
        'Flip a coin. If heads, this attack does 10 damage to each of your opponent\'s Benched Pokémon. If tails, ' +
        'this attack does 10 damage to each of your own Benched Pokémon. (Don\'t apply Weakness and Resistance for ' +
        'Benched Pokémon.)'
    },
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Articuno';

  public fullName: string = 'Articuno FO';

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
