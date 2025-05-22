import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Gastly extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 30;

  public attacks = [
    {
      name: 'Sleeping Gas',
      cost: [CardType.PSYCHIC],
      damage: '',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Asleep.'
    },
    {
      name: 'Destiny Bond',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '',
      text:
        'Discard 1 Psychic Energy card attached to Gastly in order to use this attack. If a Pokémon Knocks Out ' +
        'Gastly during your opponent\'s next turn, Knock Out that Pokémon. '
    },
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'BS';

  public name: string = 'Gastly';

  public fullName: string = 'Gastly BS';

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
