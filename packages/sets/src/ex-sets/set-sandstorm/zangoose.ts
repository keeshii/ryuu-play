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

export class Zangoose extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 70;

  public powers = [
    {
      name: 'Poison Resistance',
      powerType: PowerType.POKEBODY,
      text: 'Zangoose can\'t be Poisoned.'
    },
  ];

  public attacks = [
    {
      name: 'Target Slash',
      cost: [CardType.COLORLESS],
      damage: '10+',
      text: 'If the Defending Pokémon is Seviper, this attack does 10 damage plus 30 more damage.'
    },
    {
      name: 'Super Slash',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30+',
      text: 'If the Defending Pokémon is an Evolved Pokémon, this attack does 30 damage plus 30 more damage.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Zangoose';

  public fullName: string = 'Zangoose SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
