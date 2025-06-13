import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Parasect extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Paras';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Spore',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '',
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Slash',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Parasect';

  public fullName: string = 'Parasect JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
