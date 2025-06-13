import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Shiftry2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Nuzleaf';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 120;

  public attacks = [
    {
      name: 'Feint Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Choose 1 of your opponent\'s Pokémon. This attack does 40 damage to that Pokémon. This attack\'s damage ' +
        'isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on that Pokémon.'
    },
    {
      name: 'Slash',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '60',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Shiftry';

  public fullName: string = 'Shiftry SS-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
