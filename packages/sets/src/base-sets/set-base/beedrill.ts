import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Beedrill extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Kakuna';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public attacks = [
    {
      name: 'Twineedle',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30×',
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
    },
    {
      name: 'Poison Sting',
      cost: [CardType.GRASS, CardType.GRASS, CardType.GRASS],
      damage: '40',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'BS';

  public name: string = 'Beedrill';

  public fullName: string = 'Beedrill BS';

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
