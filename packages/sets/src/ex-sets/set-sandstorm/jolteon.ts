import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Jolteon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Double Kick',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20×',
      text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
    },
    {
      name: 'Lightning Strike',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: '40',
      text:
        'You may discard all L Energy cards attached to Jolteon. If you do, this attack\'s base damage is 70 instead ' +
        'of 40.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.METAL, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Jolteon';

  public fullName: string = 'Jolteon SS';

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
