import {
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Cacnea extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 50;

  public powers = [
    {
      name: 'Poison Payback',
      powerType: PowerType.POKEBODY,
      text:
        'If Cacnea is your Active Pokémon and is damaged by an opponent\'s attack (even if Cacnea is Knocked Out), ' +
        'the Attacking Pokémon is now Poisoned.'
    },
  ];

  public attacks = [
    {
      name: 'Light Punch',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Cacnea';

  public fullName: string = 'Cacnea SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    return state;
  }
}
