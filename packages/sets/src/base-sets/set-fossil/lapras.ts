import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Lapras extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Water Gun',
      cost: [CardType.WATER],
      damage: '10+',
      text:
        'Does 10 damage plus 10 more damage for each W Energy attached to Lapras but not used to pay for this ' +
        'attack\'s Energy cost. You can\'t add more than 20 damage in this way.'
    },
    {
      name: 'Confuse Ray',
      cost: [CardType.WATER, CardType.WATER],
      damage: '10',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Lapras';

  public fullName: string = 'Lapras FO';

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
