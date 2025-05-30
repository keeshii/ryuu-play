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

export class Machoke extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Machop';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 80;

  public attacks = [
    {
      name: 'Karate Chop',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: '50-',
      text: 'Does 50 damage minus 10 damage for each damage counter on Machoke.'
    },
    {
      name: 'Submission',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '60',
      text: 'Machoke does 20 damage to itself.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Machoke';

  public fullName: string = 'Machoke BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      effect.damage -= Math.min(50, effect.player.active.damage);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const dealDamage = new DealDamageEffect(effect, 20);
      dealDamage.target = player.active;
      store.reduceEffect(state, dealDamage);
    }

    return state;
  }
}
