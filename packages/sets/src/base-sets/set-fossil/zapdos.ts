import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Zapdos extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Thunderstorm',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING],
      damage: '40',
      text:
        'For each of your opponent\'s Benched Pokémon, flip a coin. If heads, this attack does 20 damage to that ' +
        'Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Then, Zapdos does 10 damage times the ' +
        'number of tails to itself.'
    },
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Zapdos';

  public fullName: string = 'Zapdos FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
