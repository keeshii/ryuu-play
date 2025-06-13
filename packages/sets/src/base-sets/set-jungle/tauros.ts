import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Tauros extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 60;

  public attacks = [
    {
      name: 'Stomp',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20+',
      text:
        'Flip a coin. If heads, this attack does 20 damage plus 10 more damage; if tails, this attack does 20 ' +
        'damage.'
    },
    {
      name: 'Rampage',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '20+',
      text:
        'Does 20 damage plus 10 more damage for each damage counter on Tauros. Flip a coin. If tails, Tauros is now ' +
        'Confused (after doing damage).'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Tauros';

  public fullName: string = 'Tauros JU';

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
