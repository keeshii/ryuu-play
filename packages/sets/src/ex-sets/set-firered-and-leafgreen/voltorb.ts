import {
  AttackEffect,
  CardType,
  CheckRetreatCostEffect,
  Effect,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StoreLike,
} from '@ptcg/common';
import { commonAttacks } from '../../common';

export class Voltorb extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.LIGHTNING];

  public hp: number = 50;

  public powers = [
    {
      name: 'Floating Electrons',
      powerType: PowerType.POKEBODY,
      text: 'As long as Voltorb has any Energy attached to it, Voltorb\'s Retreat Cost is 0.'
    },
  ];

  public attacks = [
    {
      name: 'Thundershock',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: '20',
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
  ];

  public weakness = [
    { type: CardType.FIGHTING }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Voltorb';

  public fullName: string = 'Voltorb RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const flipSpecialConditions = commonAttacks.flipSpecialConditions(this, store, state, effect);

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.pokemons.cards.includes(this)) {
      const player = effect.player;

      if (player.active.getPokemonCard() !== this) {
        return state;
      }

      // Energies attached to the active Pokemon
      if (player.active.energies.cards.length === 0) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.cost = [];
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return flipSpecialConditions.use(effect, [SpecialCondition.PARALYZED]);
    }

    return state;
  }
}
