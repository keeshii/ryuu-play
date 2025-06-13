import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Omanyte extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Mysterious Fossil';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Team Assembly',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Search your deck for Omanyte, Kabuto, or any Basic Pokémon and put as many of them as you like onto your ' +
        'Bench. Shuffle your deck afterward. Treat the new Benched Pokémon as Basic Pokémon.'
    },
    {
      name: 'Bind',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Omanyte';

  public fullName: string = 'Omanyte SS';

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
