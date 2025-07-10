import {
  AttackEffect,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

import { commonAttacks } from '../../common';

export class Kirlia extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Ralts';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 70;

  public attacks = [
    {
      name: 'Psyshock',
      cost: [CardType.PSYCHIC, CardType.COLORLESS],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Link Blast',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: '60',
      text:
        'If Kirlia and the Defending Pokémon have a different amount of Energy attached to them, this attack\'s base ' +
        'damage is 30 instead of 60.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Kirlia';

  public fullName: string = 'Kirlia SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipSpecialConditions = commonAttacks.flipSpecialConditions(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return flipSpecialConditions.use(effect, [SpecialCondition.PARALYZED]);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkPlayerEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkPlayerEnergy);
      const playerEnergies = checkPlayerEnergy.energyMap.reduce((left, p) => left + p.provides.length, 0);

      const checkOpponentEnergy = new CheckProvidedEnergyEffect(opponent);
      state = store.reduceEffect(state, checkOpponentEnergy);
      const opponentEnergies = checkOpponentEnergy.energyMap.reduce((left, p) => left + p.provides.length, 0);

      if (playerEnergies !== opponentEnergies) {
        effect.damage = 30;
      }
    }

    return state;
  }
}
