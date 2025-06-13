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

export class Lunatone extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 60;

  public powers = [
    {
      name: 'Lunar Eclipse',
      powerType: PowerType.POKEPOWER,
      text:
        'Once during your turn (before your attack), if Solrock is in play, you may use this power. Until the end ' +
        'of your turn, Lunatone\'s type is D. This power can\'t be used if Lunatone is affected by a Special ' +
        'Condition.'
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
      name: 'Lunar Blast',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Lunatone';

  public fullName: string = 'Lunatone SS';

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
