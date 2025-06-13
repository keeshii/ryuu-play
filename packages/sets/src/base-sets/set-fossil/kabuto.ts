import {
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

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 30;

  public powers = [
    {
      name: 'Kabuto Armor',
      powerType: PowerType.POKEPOWER,
      text:
        'Whenever an attack (even your own) does damage to Kabuto (after applying Weakness and Resistance), that ' +
        'attack does half the damage to Kabuto (rounded down to the nearest 10). (Any other effects of attacks ' +
        'still happen.) This power stops working while Kabuto is Asleep, Confused, or Paralyzed.'
    },
  ];

  public attacks = [
    {
      name: 'Scratch',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Kabuto';

  public fullName: string = 'Kabuto FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    return state;
  }
}
