import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Rapidash extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Ponyta';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Stomp',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20+',
      text:
        'Flip a coin. If heads, this attack does 20 damage plus 10 more damage; if tails, this attack does 20 ' +
        'damage.'
    },
    {
      name: 'Agility',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
      damage: '30',
      text:
        'Flip a coin. If heads, during your opponent\'s next turn, prevent all effects of attacks, including damage, ' +
        'done to Rapidash.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [];

  public set: string = 'JU';

  public name: string = 'Rapidash';

  public fullName: string = 'Rapidash JU';

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
