import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Hypno extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Drowzee';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 90;

  public attacks = [
    {
      name: 'Prophecy',
      cost: [CardType.PSYCHIC],
      damage: '',
      text: 'Look at up to 3 cards from the top of either player\'s deck and rearrange them as you like.'
    },
    {
      name: 'Dark Mind',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.PSYCHIC],
      damage: '30',
      text:
        'If your opponent has any Benched Pokémon, choose 1 of them and this attack does 10 damage to it. (Don\'t ' +
        'apply Weakness and Resistance for Benched Pokémon.)'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'FO';

  public name: string = 'Hypno';

  public fullName: string = 'Hypno FO';

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
