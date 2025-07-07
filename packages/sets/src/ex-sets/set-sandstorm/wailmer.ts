import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Wailmer extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Rollout',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
    {
      name: 'Super Hypno Wave',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: 'The Defending Pokémon is now Asleep.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Wailmer';

  public fullName: string = 'Wailmer SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, specialConditionEffect);
    }

    return state;
  }
}
