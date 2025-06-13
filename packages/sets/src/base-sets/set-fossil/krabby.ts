import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Krabby extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Call for Family',
      cost: [CardType.WATER],
      damage: '',
      text:
        'Search your deck for a Basic Pokémon named Krabby and put it onto your Bench. Shuffle your deck afterward. ' +
        '(You can\'t use this attack if your Bench if full.)'
    },
    {
      name: 'Irongrip',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Krabby';

  public fullName: string = 'Krabby FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
