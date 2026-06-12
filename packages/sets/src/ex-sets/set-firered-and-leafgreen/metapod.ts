import {
  CardType,
  CheckProvidedEnergyEffect,
  Effect,
  GamePhase,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Metapod extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Caterpie';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 80;

  public powers = [
    {
      name: 'Energy Protection',
      powerType: PowerType.POKEBODY,
      text:
        'Any damage done to Metapod by attacks is reduced by 10 for each Energy attached to Metapod. You can\'t ' +
        'reduce more than 30 damage in this way.'
    },
  ];

  public attacks = [
    {
      name: 'Sharpen',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public set: string = 'RG';

  public name: string = 'Metapod';

  public fullName: string = 'Metapod RG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Reduce damage by 20
    if (effect instanceof PutDamageEffect && effect.target.pokemons.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      // It's not this pokemon card, or it's not an attack
      if (pokemonCard !== this || state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      checkProvidedEnergy.source = effect.target;
      state = store.reduceEffect(state, checkProvidedEnergy);
      const energyCount = checkProvidedEnergy.energyMap.reduce((left, p) => left + p.provideAmount, 0);

      const reduction = Math.min(energyCount, 3) * 10;
      effect.damage = Math.max(0, effect.damage - reduction);
    }


    return state;
  }
}
