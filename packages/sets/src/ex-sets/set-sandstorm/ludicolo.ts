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

export class Ludicolo extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Lombre';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 90;

  public powers = [
    {
      name: 'Rain Dish',
      powerType: PowerType.POKEBODY,
      text: 'At any time between turns, remove 1 damage counter from Ludicolo.'
    },
  ];

  public attacks = [
    {
      name: 'Hydro Punch',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '50+',
      text:
        'Does 50 damage plus 10 more damage for each W Energy attached to Ludicolo but not used to pay for this ' +
        'attack\'s Energy cost. You can\'t add more than 20 damage in this way.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Ludicolo';

  public fullName: string = 'Ludicolo SS';

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
