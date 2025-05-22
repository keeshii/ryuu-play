import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Weezing extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Koffing';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public attacks = [
    {
      name: 'Confusion Gas',
      cost: [CardType.GRASS],
      damage: '10',
      text: 'The Defending Pokémon is now Confused.'
    },
    {
      name: 'Poison Smog',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: '',
      text:
        'Each Defending Pokémon is now Poisoned. Does 10 damage to each of your opponent\'s Benched Pokémon. (Don\'t ' +
        'apply Weakness and Resistance for Benched Pokémon.) '
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Weezing';

  public fullName: string = 'Weezing RS';

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
