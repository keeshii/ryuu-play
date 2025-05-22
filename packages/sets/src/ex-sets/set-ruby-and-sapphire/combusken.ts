import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Combusken extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Torchic';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 70;

  public attacks = [
    {
      name: 'Flare',
      cost: [CardType.FIRE],
      damage: '20',
      text: ''
    },
    {
      name: 'Double Kick',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40×',
      text: 'Flip 2 coins. This attack does 40 damage times the number of heads.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Combusken';

  public fullName: string = 'Combusken RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      return state;
    }

    return state;
  }
}
