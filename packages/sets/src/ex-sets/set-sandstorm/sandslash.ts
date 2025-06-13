import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Sandslash extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Sandshrew';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Sand Swirl',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: '',
      text:
        'Does 20 damage to each Defending Pokémon. The Defending Pokémon can\'t retreat until the end of your ' +
        'opponent\'s next turn.'
    },
    {
      name: 'Earthquake',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '60',
      text:
        'Does 10 damage to each of your Benched Pokémon. (Don\'t apply Weakness or Resistance for Benched Pokémon.)'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [];

  public set: string = 'SS';

  public name: string = 'Sandslash';

  public fullName: string = 'Sandslash SS';

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
