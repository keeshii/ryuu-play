import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Nidoking extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Nidorino';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 90;

  public attacks = [
    {
      name: 'Thrash',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30+',
      text:
        'Flip a coin. If heads, this attack does 30 damage plus 10 more damage; if tails, this attack does 30 ' +
        'damage and Nidoking does 10 damage to itself. '
    },
    {
      name: 'Toxic',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS],
      damage: '20',
      text:
        'The Defending Pokémon is now Poisoned. It now takes 20 Poison damage instead of 10 after each player\'s ' +
        'turn (even if it was already Poisoned). '
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Nidoking';

  public fullName: string = 'Nidoking BS';

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
