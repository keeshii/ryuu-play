import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Victreebel extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Weepinbell';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Lure',
      cost: [CardType.GRASS],
      damage: '',
      text: 'If your opponent has any Benched Pokémon, choose 1 of them and switch it with his or her Active Pokémon.'
    },
    {
      name: 'Acid',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon can\'t retreat during your next turn.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Victreebel';

  public fullName: string = 'Victreebel JU';

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
