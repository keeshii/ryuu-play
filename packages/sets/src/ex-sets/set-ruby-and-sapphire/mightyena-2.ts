import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Mightyena2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Poochyena';

  public cardType: CardType = CardType.DARK;

  public hp: number = 70;

  public attacks = [
    {
      name: 'Bite',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
    {
      name: 'Ambush',
      cost: [CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
      damage: '30+',
      text: 'Flip a coin. If heads, this attack does 30 damage plus 30 more damage.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public resistance = [
    { type: CardType.PSYCHIC, value: -30 }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Mightyena';

  public fullName: string = 'Mightyena RS-2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
