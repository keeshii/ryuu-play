import {
  AttackEffect,
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  PlayerType,
  PokemonCard,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class Espeon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardTypes: CardType[] = [CardType.PSYCHIC];

  public hp: number = 80;

  public attacks = [
    {
      name: 'Confuse Ray',
      cost: [CardType.PSYCHIC],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
    },
    {
      name: 'Energy Crush',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '20+',
      text: 'Does 20 more damage plus 10 more damage for each Energy attached to all of your opponent\'s Pokémon.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Espeon';

  public fullName: string = 'Espeon SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipSpecialConditions = commonAttacks.flipSpecialConditions(this, store, state, effect);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return flipSpecialConditions.use(effect, [SpecialCondition.CONFUSED]);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let energies = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, pokemonSlot => {
        const checkProvidedEnergy = new CheckProvidedEnergyEffect(opponent, pokemonSlot);
        state = store.reduceEffect(state, checkProvidedEnergy);
        energies += checkProvidedEnergy.energyMap.reduce((left, p) => left + p.provides.length, 0);
      });

      effect.damage += energies * 10;
    }

    return state;
  }
}
