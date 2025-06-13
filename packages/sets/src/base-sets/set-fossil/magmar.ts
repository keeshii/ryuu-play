import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Magmar extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Smokescreen',
      cost: [CardType.FIRE],
      damage: '10',
      text:
        'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If ' +
        'tails, that attack does nothing.'
    },
    {
      name: 'Smog',
      cost: [CardType.FIRE, CardType.FIRE],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Magmar';

  public fullName: string = 'Magmar FO';

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
