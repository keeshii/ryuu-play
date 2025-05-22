import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Breloom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Shroomish';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public attacks = [
    {
      name: 'Headbutt',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
    {
      name: 'Battle Blast',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40+',
      text: 'Does 40 damage plus 10 more damage for each Fighting Energy attached to Breloom.'
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Breloom';

  public fullName: string = 'Breloom RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
