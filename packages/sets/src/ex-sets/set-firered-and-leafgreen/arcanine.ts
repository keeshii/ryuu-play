import {
  AttackEffect,
  CardType,
  DealDamageEffect,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Arcanine extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Growlithe';

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 90;

  public attacks = [
    {
      name: 'Flare',
      cost: [CardType.FIRE],
      damage: '20',
      text: ''
    },
    {
      name: 'Heat Tackle',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '70',
      text: 'Arcanine does 10 damage to itself.'
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Arcanine';

  public fullName: string = 'Arcanine RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 10);
      dealDamage.target = player.active;
      store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}
