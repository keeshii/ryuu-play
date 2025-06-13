import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Wobbuffet extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 80;

  public powers = [
    {
      name: 'Safeguard',
      powerType: PowerType.POKEBODY,
      text: 'Prevent all effects of attacks, including damage, done to Wobbuffet by your opponent\'s Pokémon-ex.'
    },
  ];

  public attacks = [
    {
      name: 'Flip Over',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50',
      text: 'Wobbuffet does 10 damage to itself, and don\'t apply Weakness and Resistance to this damage.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Wobbuffet';

  public fullName: string = 'Wobbuffet SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
