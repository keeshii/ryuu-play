import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Shellder extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 30;

  public attacks = [
    {
      name: 'Supersonic',
      cost: [CardType.WATER],
      damage: '',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    },
    {
      name: 'Hide in Shell',
      cost: [CardType.WATER],
      damage: '',
      text:
        'Flip a coin. If heads, prevent all damage done to Shellder during your opponent\'s next turn. (Any other ' +
        'effects of attacks still happen.)'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Shellder';

  public fullName: string = 'Shellder FO';

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
