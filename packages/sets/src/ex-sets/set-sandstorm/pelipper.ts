import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Pelipper extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Wingull';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Water Gun',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '30+',
      text:
        'This attack does 30 damage plus 10 more damage for each W Energy attached to Pelipper but not used to pay ' +
        'for this attack\'s Energy cost. You can\'t add more than 20 damage in this way.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'SS';

  public name: string = 'Pelipper';

  public fullName: string = 'Pelipper SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
