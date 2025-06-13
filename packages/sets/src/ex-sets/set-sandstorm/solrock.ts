import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Solrock extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 70;

  public powers = [
    {
      name: 'Solar Eclipse',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), if Lunatone is in play, you may use this power. Until the end ' +
        'of your turn, Solrock\'s type is R. This power can\'t be used if Solrock is affected by a Special Condition.'
    },
  ];

  public attacks = [
    {
      name: 'Cosmic Draw',
      cost: [CardType.COLORLESS],
      damage: '',
      text: 'If your opponent has any Evolved Pokémon in play, draw 3 cards.'
    },
    {
      name: 'Solar Blast',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Solrock';

  public fullName: string = 'Solrock SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
