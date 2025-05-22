import {
  AttackEffect,
  CardType,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Arcanine extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Growlithe';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 100;

  public attacks = [
    {
      name: 'Flamethrower',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
      damage: '50',
      text: 'Discard 1 Fire Energy card attached to Arcanine in order to use this attack.'
    },
    {
      name: 'Take Down',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: '80',
      text: 'Arcanine does 30 damage to itself.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Arcanine';

  public fullName: string = 'Arcanine BS';

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
