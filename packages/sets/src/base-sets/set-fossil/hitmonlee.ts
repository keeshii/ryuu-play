import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Hitmonlee extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Stretch Kick',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: '',
      text:
        'If your opponent has any Benched Pokémon, choose 1 of them and this attack does 20 damage to it. (Don\'t ' +
        'apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'High Jump Kick',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING],
      damage: '50',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Hitmonlee';

  public fullName: string = 'Hitmonlee FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
