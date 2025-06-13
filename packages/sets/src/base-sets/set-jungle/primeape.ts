import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Primeape extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Mankey';

  public cardTypes: CardType[] = [CardType.FIGHTING];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Fury Swipes',
      cost: [CardType.FIGHTING, CardType.FIGHTING],
      damage: '20×',
      text: 'Flip 3 coins. This attack does 20 damage times the number of heads.'
    },
    {
      name: 'Tantrum',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: '50',
      text: 'Flip a coin. If tails, Primeape is now Confused (after doing damage).'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'JU';

  public name: string = 'Primeape';

  public fullName: string = 'Primeape JU';

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
