import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Poliwhirl extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Poliwag';

  public cardType: CardType = CardType.WATER;

  public hp: number = 60;

  public attacks = [
    {
      name: 'Amnesia',
      cost: [CardType.WATER, CardType.WATER],
      damage: '',
      text:
        'Choose 1 of the Defending Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s ' +
        'next turn. '
    },
    {
      name: 'Doubleslap',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: '30×',
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Poliwhirl';

  public fullName: string = 'Poliwhirl BS';

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
