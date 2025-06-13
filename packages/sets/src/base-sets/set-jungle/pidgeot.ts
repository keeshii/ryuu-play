import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Pidgeot extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Pidgeotto';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Wing Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
    {
      name: 'Hurricane',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30',
      text:
        'Unless this attack Knocks Out the Defending Pokémon, return the Defending Pokémon and all cards attached ' +
        'to it to your opponent\'s hand.'
    },
  ];

  public weakness = [
    { type: CardType.LIGHTNING }
  ];

  public resistance = [
    { type: CardType.FIGHTING, value: -30 }
  ];

  public retreat = [];

  public set: string = 'JU';

  public name: string = 'Pidgeot';

  public fullName: string = 'Pidgeot JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
