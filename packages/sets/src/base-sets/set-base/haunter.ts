import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Haunter extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Gastly';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public attacks = [
    {
      name: 'Hypnosis',
      cost: [CardType.PSYCHIC],
      damage: '',
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Dream Eater',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: '50',
      text: 'You can\'t use this attack unless the Defending Pokémon is Asleep.'
    },
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Haunter';

  public fullName: string = 'Haunter BS';

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
