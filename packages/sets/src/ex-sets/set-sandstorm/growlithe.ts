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

export class Growlithe extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 50;

  public powers = [
    {
      name: 'Fire Veil',
      powerType: PowerType.POKEBODY,
      text:
        'If Growlithe is your Active Pokémon and is damaged by an opponent\'s attack (even if Growlithe is Knocked ' +
        'Out), the Attacking Pokémon is now Burned.'
    },
  ];

  public attacks = [
    {
      name: 'Flare',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Growlithe';

  public fullName: string = 'Growlithe SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    return state;
  }
}
