import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Donphan extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Phanpy';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 80;

  public attacks = [
    {
      name: 'Rend',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: '20+',
      text: 'If the Defending Pokémon has any damage counters on it, this attack does 20 damage plus 20 more damage.'
    },
    {
      name: 'Double Spin',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '60×',
      text: 'Flip 2 coins. This attack does 60 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Donphan';

  public fullName: string = 'Donphan RS';

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
