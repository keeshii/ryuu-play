import {
  AttackEffect,
  CardType,
  CheckAttackCostEffect,
  CheckProvidedEnergyEffect,
  Effect,
  PokemonCard,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Poliwag extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 40;

  public attacks = [
    {
      name: 'Water Gun',
      cost: [CardType.WATER],
      damage: '10+',
      text:
        'Does 10 damage plus 10 more damage for each Water Energy attached to Poliwag but not used to pay for this ' +
        'attack\'s Energy cost. Extra Water Energy after the 2nd don\'t count.'
    },
  ];

  public weakness = [
    { type: CardType.GRASS }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'BS';

  public name: string = 'Poliwag';

  public fullName: string = 'Poliwag BS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
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
