import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Anorith extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Claw Fossil';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Fast Evolution',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for an Evolution card, show it to your opponent, and put it into your hand. Shuffle your ' +
        'deck afterward.'
    },
    {
      name: 'Pierce',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Anorith';

  public fullName: string = 'Anorith SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
