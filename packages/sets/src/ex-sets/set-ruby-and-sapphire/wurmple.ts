import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Wurmple extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 50;

  public attacks = [
    {
      name: 'Signs of Evolution',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for Silcoon and Beautifly, or Cascoon and Dustox cards. Show 1 card or both cards of a ' +
        'pair to your opponent and put them into your hand. Shuffle your deck afterward. '
    },
    {
      name: 'Poison Barb',
      cost: [CardType.GRASS],
      damage: '',
      text: 'The Defending Pokémon is now Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Wurmple';

  public fullName: string = 'Wurmple RS';

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
