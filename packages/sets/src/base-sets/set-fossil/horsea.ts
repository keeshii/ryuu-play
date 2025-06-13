import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Horsea extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 40;

  public attacks = [
    {
      name: 'Smokescreen',
      cost: [CardType.WATER],
      damage: '10',
      text:
        'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If ' +
        'tails, that attack does nothing.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [];

  public set: string = 'FO';

  public name: string = 'Horsea';

  public fullName: string = 'Horsea FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
