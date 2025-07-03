import {
  AttackEffect,
  CardTag,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  HealTargetEffect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

import { commonAttacks } from '../../common';

export class KabutopsEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Kabuto';

  public cardTypes: CardType[] = [CardType.WATER];

  public hp: number = 150;

  public attacks = [
    {
      name: 'Hydrocutter',
      cost: [CardType.COLORLESS],
      damage: '40×',
      text:
        'Flip a number of coins equal to the amount of Energy attached to Kabutops ex. This attack does 40 damage ' +
        'times the number of heads. You can\'t flip more than 3 coins in this way.'
    },
    {
      name: 'Spiral Drain',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: '70',
      text: 'Remove 2 damage counter from Kabutops ex (remove 1 if there is only 1).'
    },
  ];

  public weakness = [
    { type: CardType.GRASS },
    { type: CardType.LIGHTNING }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Kabutops ex';

  public fullName: string = 'Kabutops ex SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipDamageTimes = commonAttacks.flipDamageTimes(this, store, state, effect);
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);
      const energyCount = checkProvidedEnergy.energyMap.reduce((left, p) => left + p.provides.length, 0);
      return flipDamageTimes.use(effect, Math.min(3, energyCount), 40);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const healEffect = new HealTargetEffect(effect, 20);
      healEffect.target = player.active;
      return store.reduceEffect(state, healEffect);
    }

    return state;
  }
}
