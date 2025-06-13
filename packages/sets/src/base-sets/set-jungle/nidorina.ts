import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Nidorina extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Nidoran ♀';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Supersonic',
      cost: [CardType.GRASS],
      damage: '',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    },
    {
      name: 'Double Kick',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30×',
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Nidorina';

  public fullName: string = 'Nidorina JU';

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
