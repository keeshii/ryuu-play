import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Weezing extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Koffing';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Smog',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
    },
    {
      name: 'Selfdestruct',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: '60',
      text:
        'Does 10 damage to each Pokémon on each player\'s Bench. (Don\'t apply Weakness and Resistance for Benched ' +
        'Pokémon.) Weezing does 60 damage to itself.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Weezing';

  public fullName: string = 'Weezing FO';

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
