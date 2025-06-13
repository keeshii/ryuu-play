import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Sableye extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.DARK];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Supernatural',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Look at your opponent\'s hand. You may use the effect of a Supporter card you find there as the effect of ' +
        'this attack. (The Supporter card remains in your opponent\'s hand.)'
    },
    {
      name: 'Dark Bind',
      cost: [CardType.DARK, CardType.COLORLESS],
      damage: '20',
      text: 'You may discard a D Energy card attached to Sableye. If you do, the Defending Pokémon is now Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Sableye';

  public fullName: string = 'Sableye SS';

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
