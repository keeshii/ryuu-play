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

export class Omanyte extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Mysterious Fossil';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 40;

  public powers = [
    {
      name: 'Clairvoyance',
      powerType: PowerType.POKEPOWER,
      text:
        'Your opponent plays with his or her hand face up. This power stops working while Omanyte is Asleep, ' +
        'Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Water Gun',
      cost: [CardType.WATER],
      damage: '10+',
      text:
        'Does 10 damage plus 10 more damage for each W Energy attached to Omanyte but not used to pay for this ' +
        'attack\'s Energy cost. You can\'t add more than 20 damage in this way.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Omanyte';

  public fullName: string = 'Omanyte FO';

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
