import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Pelipper extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Wingull';

  public cardType: CardType = CardType.WATER;

  public hp: number = 70;

  public attacks = [
    {
      name: 'Stockpile',
      cost: [CardType.COLORLESS],
      damage: '',
      text:
        'During your next turn, Spit Up\'s base damage is 70 instead of 30, and Swallow\'s base damage is 60 instead ' +
        'of 20. '
    },
    {
      name: 'Spit Up',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '30',
      text: ''
    },
    {
      name: 'Swallow',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text:
        'After your attack, remove from Pelipper the number of damage counters equal to the damage you did to the ' +
        'Defending Pokémon. If Pelipper has fewer damage counters than that, remove all of them. '
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Pelipper';

  public fullName: string = 'Pelipper RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[2]) {
      return state;
    }

    return state;
  }
}
