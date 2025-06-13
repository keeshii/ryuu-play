import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Baltoy extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Rapid Spin',
      cost: [CardType.COLORLESS],
      damage: '10',
      text:
        'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon, if any. You switch ' +
        'Baltoy with 1 of your Benched Pokémon, if any.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Baltoy';

  public fullName: string = 'Baltoy SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
