import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';

export class Sceptile extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Grovyle';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 120;

  public attacks = [
    {
      name: 'Lizard Poison',
      cost: [CardType.COLORLESS],
      damage: '20',
      text:
        'If 1 Energy is attached to Sceptile, the Defending Pokémon is now Asleep. If 2 Energy is attached to ' +
        'Sceptile, the Defending Pokémon is now Poisoned. If 3 Energy is attached to Sceptile, the Defending ' +
        'Pokémon is now Asleep and Poisoned. If 4 or more Energy is attached to Sceptile, the Defending Pokémon is ' +
        'now Asleep, Burned, and Poisoned.',
    },
    {
      name: 'Solarbeam',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '70',
      text: '',
    },
  ];

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.WATER, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RS';

  public name: string = 'Sceptile';

  public fullName: string = 'Sceptile RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);
      const energyCount = checkProvidedEnergy.energyMap.reduce((left, p) => left + p.provides.length, 0);

      switch (energyCount) {
        case 0:
          break;
        case 1:
          store.reduceEffect(state, new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]));
          break;
        case 2:
          store.reduceEffect(state, new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]));
          break;
        case 3:
          store.reduceEffect(state, new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]));
          store.reduceEffect(state, new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]));
          break;
        default:
          store.reduceEffect(state, new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]));
          store.reduceEffect(state, new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]));
          store.reduceEffect(state, new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]));
      }

      return state;
    }

    return state;
  }
}
