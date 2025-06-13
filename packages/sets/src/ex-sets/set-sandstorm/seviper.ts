import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Seviper extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Deadly Poison',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: 'You may discard a G Energy card attached to Seviper. If you do, the Defending Pokémon is now Poisoned.'
    },
    {
      name: 'Extra Poison',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: 'If the Defending Pokémon is Pokémon-ex, the Defending Pokémon is now Asleep and Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Seviper';

  public fullName: string = 'Seviper SS';

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
