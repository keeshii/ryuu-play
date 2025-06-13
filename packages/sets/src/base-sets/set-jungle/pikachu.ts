import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Pikachu extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Spark',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING],
      damage: '20',
      text:
        'If your opponent has any Benched Pokémon, choose 1 of them and this attack does 10 damage to it. (Don\'t ' +
        'apply Weakness and Resistance for Benched Pokémon.)'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Pikachu';

  public fullName: string = 'Pikachu JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
