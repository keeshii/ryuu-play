import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Kadabra extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Abra';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 60;

  public attacks = [
    {
      name: 'Recover',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC],
      damage: '',
      text:
        'Discard 1 Psychic Energy card attached to Kadabra in order to use this attack. Remove all damage counters ' +
        'from Kadabra. '
    },
    {
      name: 'Super Psy',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: '50',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Kadabra';

  public fullName: string = 'Kadabra BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return state;
    }

    return state;
  }
}
