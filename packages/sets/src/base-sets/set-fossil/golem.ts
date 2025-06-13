import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Golem extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Graveler';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Avalanche',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: '60',
      text: ''
    },
    {
      name: 'Selfdestruct',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING],
      damage: '100',
      text:
        'Does 20 damage to each Pokémon on each player\'s Bench. (Don\'t apply Weakness and Resistance for Benched ' +
        'Pokémon.) Golem does 100 damage to itself.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Golem';

  public fullName: string = 'Golem FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
