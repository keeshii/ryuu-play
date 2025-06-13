import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Duskull2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 40;

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
      name: 'Confuse Ray',
      cost: [CardType.PSYCHIC],
      damage: '',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    },
  ];

  public weakness = [
    { type: CardType.DARK }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Duskull';

  public fullName: string = 'Duskull SS-2';

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
