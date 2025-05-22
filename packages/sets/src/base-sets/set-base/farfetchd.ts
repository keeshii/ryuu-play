import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Farfetchd extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 50;

  public attacks = [
    {
      name: 'Leek Slap',
      cost: [CardType.COLORLESS],
      damage: '30',
      text:
        'Flip a coin. If tails, this attack does nothing. Either way, you can\'t use this attack again as long as ' +
        'Farfetch\'d stays in play (even putting Farfetch\'d on the Bench won\'t let you use it again). '
    },
    {
      name: 'Pot Smash',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Farfetch\'d';

  public fullName: string = 'Farfetch\'d BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
