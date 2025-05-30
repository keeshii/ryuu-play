import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Magikarp extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 30;

  public attacks = [
    {
      name: 'Tackle',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
    {
      name: 'Flail',
      cost: [CardType.WATER],
      damage: '10×',
      text: 'Does 10 damage times the number of damage counters on Magikarp.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Magikarp';

  public fullName: string = 'Magikarp BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      effect.damage = effect.player.active.damage;
      return state;
    }

    return state;
  }
}
