import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Electabuzz extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Plasma',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: 'Flip a coin. If heads, search your discard pile for a L Energy card and attach it to Electabuzz.'
    },
    {
      name: 'Thunder Spear',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Choose 1 of your opponent\'s Pokémon. This attack does 40 damage to that Pokémon. (Don\'t apply Weakness and ' +
        'Resistance for Benched Pokémon.)'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.METAL, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Electabuzz';

  public fullName: string = 'Electabuzz SS';

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
