import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Gyarados extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Magikarp';

  public cardType: CardType = CardType.WATER;

  public hp: number = 100;

  public attacks = [
    {
      name: 'Dragon Rage',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER],
      damage: '50',
      text: ''
    },
    {
      name: 'Bubblebeam',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER, CardType.WATER],
      damage: '40',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Gyarados';

  public fullName: string = 'Gyarados BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
