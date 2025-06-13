import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Murkrow extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.DARK];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Surprise',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Choose 1 card from your opponent\'s hand without looking. Look at the card you chose, then have your ' +
        'opponent shuffle that card into his or her deck.'
    },
    {
      name: 'Dark Mind',
      cost: [CardType.DARK, CardType.COLORLESS],
      damage: '20',
      text:
        'Does 10 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched ' +
        'Pokémon.)'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Murkrow';

  public fullName: string = 'Murkrow SS';

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
