import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Poliwrath extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Poliwhirl';

  public cardType: CardType = CardType.WATER;

  public hp: number = 90;

  public attacks = [
    {
      name: 'Water Gun',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: '30+',
      text:
        'Does 30 damage plus 10 more damage for each Water Energy attached to Poliwrath but not used to pay for ' +
        'this attack\'s Energy cost. Extra Water Energy after the 2nd doesn\'t count. '
    },
    {
      name: 'Whirlpool',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: 'If the Defending Pokémon has any Energy cards attached to it, choose 1 of them and discard it.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Poliwrath';

  public fullName: string = 'Poliwrath BS';

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
