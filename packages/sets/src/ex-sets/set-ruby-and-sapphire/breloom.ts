import {
  AttackEffect,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  PokemonCard,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Breloom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Shroomish';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Headbutt',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: '',
    },
    {
      name: 'Battle Blast',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '40+',
      text: 'Does 40 damage plus 10 more damage for each F Energy attached to Breloom.',
    },
  ];

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Breloom';

  public fullName: string = 'Breloom RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      let energyCount = 0;
      checkProvidedEnergy.energyMap.forEach(em => {
        energyCount += em.provides.includes(CardType.FIGHTING) ? em.provideAmount : 0;
      });
      effect.damage += 10 * energyCount;
    }
    return state;
  }
}
