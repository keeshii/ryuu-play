import {
  AttackEffect,
  CardType,
  CheckAttackCostEffect,
  CheckProvidedEnergyEffect,
  Effect,
  HealTargetEffect,
  PokemonCard,
  RemoveSpecialConditionsEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Wailmer extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 80;

  public attacks = [
    {
      name: 'Rest',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '',
      text:
        'Remove all Special Conditions and 4 damage counters from Wailmer (all if there are less than 4). Wailmer ' +
        'is now Asleep.',
    },
    {
      name: 'Water Gun',
      cost: [CardType.WATER, CardType.COLORLESS],
      damage: '20+',
      text:
        'This attack does 20 damage plus 10 more damage for each W Energy attached to Wailmer but not used to ' +
        'pay for this attack\'s Energy cost. You can\'t add more than 20 damage in this way.',
    },
  ];

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Wailmer';

  public fullName: string = 'Wailmer RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const conditions = player.active.specialConditions.slice();
      const removeSpecialConditionEffect = new RemoveSpecialConditionsEffect(effect, conditions);
      removeSpecialConditionEffect.target = player.active;
      store.reduceEffect(state, removeSpecialConditionEffect);

      const healEffect = new HealTargetEffect(effect, 40);
      healEffect.target = player.active;
      store.reduceEffect(state, healEffect);

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkAttackCost = new CheckAttackCostEffect(player, effect.attack);
      state = store.reduceEffect(state, checkAttackCost);
      const attackCost = checkAttackCost.cost;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const provided =  checkProvidedEnergyEffect.energyMap;
      const energyCount = StateUtils.countAdditionalEnergy(provided, attackCost, CardType.WATER);

      effect.damage += Math.min(energyCount, 2) * 10;
    }

    return state;
  }
}
