import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Nidoran extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Fury Swipes',
      cost: [CardType.GRASS],
      damage: '10×',
      text: 'Flip 3 coins. This attack does 10 damage times the number of heads.'
    },
    {
      name: 'Call for Family',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '',
      text:
        'Search your deck for a Basic Pokémon named Nidoran ♂ or Nidoran ♀ and put it onto your Bench. Shuffle your ' +
        'deck afterward. (You can\'t use this attack if your Bench is full.)'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Nidoran ♀';

  public fullName: string = 'Nidoran F JU';

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
