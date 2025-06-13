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

export class Illumise extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public powers = [
    {
      name: 'Glowing Screen',
      powerType: PowerType.POKEBODY,
      text:
        'As long as Volbeat is in play, any damage done to Illumise by attacks from F Pokémon and D Pokémon is ' +
        'reduced by 30. You can\'t reduce more than 30 damage even if there is more than 1 Volbeat in play.'
    },
  ];

  public attacks = [
    {
      name: 'Chaotic Noise',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, the Defending Pokémon is now Confused. If tails, the Defending Pokémon is now ' +
        'Asleep.'
    },
    {
      name: 'Pester',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: '20+',
      text:
        'If the Defending Pokémon is affected by a Special Condition, this attack does 20 damage plus 20 more ' +
        'damage.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Illumise';

  public fullName: string = 'Illumise SS';

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
