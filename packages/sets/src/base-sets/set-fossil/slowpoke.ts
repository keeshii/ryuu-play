import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Slowpoke extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 50;

  public attacks = [
    {
      name: 'Spacing Out',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'Flip a coin. If heads, remove a damage counter from Slowpoke. This attack can\'t be used if Slowpoke has no ' +
        'damage counters on it.'
    },
    {
      name: 'Scavenge',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: '',
      text:
        'Discard 1 P Energy card attached to Slowpoke in order to use this attack. Put a Trainer card from your ' +
        'discard pile into your hand.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Slowpoke';

  public fullName: string = 'Slowpoke FO';

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
