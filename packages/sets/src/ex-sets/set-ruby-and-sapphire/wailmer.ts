import { AttackEffect, CardType, Effect, PokemonCard, Stage, State, StoreLike } from '@ptcg/common';

export class Wailmer extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 80;

  public attacks = [
    {
      name: 'Rest',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Remove all Special Conditions and 4 damage counters from Wailmer (all if there are less than 4). Wailmer ' +
        'is now Asleep.',
    },
    {
      name: 'Water Gun',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '20+',
      text:
        'This attack does 20 damage plus 10 more damage for each Water Energy attached to Wailmer but not used to ' +
        'pay for this attack\'s Energy cost. You can\'t add more than 20 damage in this way.',
    },
  ];

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Wailmer';

  public fullName: string = 'Wailmer RS';

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
