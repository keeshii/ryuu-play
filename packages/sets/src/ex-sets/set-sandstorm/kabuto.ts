import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Kabuto extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Mysterious Fossil';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 60;

  public powers = [
    {
      name: 'Exoskeleton',
      powerType: PowerType.POKEBODY,
      text: 'Any damage done to Kabuto by attacks is reduced by 20 (after applying Weakness and Resistance).'
    },
  ];

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
      name: 'Pierce',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Kabuto';

  public fullName: string = 'Kabuto SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
