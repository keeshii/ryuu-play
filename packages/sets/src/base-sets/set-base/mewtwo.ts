import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Mewtwo extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public attacks = [
    {
      name: 'Psychic',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '10+',
      text: 'Does 10 damage plus 10 more damage for each Energy card attached to the Defending Pokémon.'
    },
    {
      name: 'Barrier',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: '',
      text:
        'Discard 1 Psychic Energy card attached to Mewtwo in order to prevent all effects of attacks, including ' +
        'damage, done to Mewtwo during your opponent\'s next turn. '
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Mewtwo';

  public fullName: string = 'Mewtwo BS';

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
