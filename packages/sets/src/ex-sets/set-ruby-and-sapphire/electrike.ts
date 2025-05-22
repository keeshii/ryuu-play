import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Electrike extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 50;

  public attacks = [
    {
      name: 'Charge',
      cost: [CardType.LIGHTNING],
      damage: '',
      text: 'Attach a Lightning Energy card from your discard pile to Electrike.'
    },
    {
      name: 'Thunder Jolt',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: '30',
      text: 'Flip a coin. If tails, Electrike does 10 damage to itself.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.METAL, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Electrike';

  public fullName: string = 'Electrike RS';

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
