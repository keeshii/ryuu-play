import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Starmie extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Staryu';

  public cardType: CardType = CardType.WATER;

  public hp: number = 60;

  public attacks = [
    {
      name: 'Recover',
      cost: [CardType.WATER, CardType.WATER],
      damage: '',
      text:
        'Discard 1 Water Energy card attached to Starmie in order to use this attack. Remove all damage counters ' +
        'from Starmie. '
    },
    {
      name: 'Star Freeze',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Starmie';

  public fullName: string = 'Starmie BS';

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
