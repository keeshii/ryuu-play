import {
  AddSpecialConditionsEffect,
  AttackEffect,
  CardType,
  DealDamageEffect,
  Effect,
  GamePhase,
  PokemonCard,
  PowerEffect,
  PowerType,
  PutDamageEffect,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

// Reduce damage by 10 (before weakness and resistance)
function useIntimidatingFang(
  effect: DealDamageEffect | PutDamageEffect,
  store: StoreLike,
  state: State,
  self: Arbok
): State {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  // It's not an attack
  if (state.phase !== GamePhase.ATTACK) {
    return state;
  }

  // Arbok is not Active Pokemon
  if (opponent.active.getPokemonCard() !== self) {
    return state;
  }

  // Try to reduce PowerEffect, to check if something is blocking our ability
  try {
    const powerEffect = new PowerEffect(player, self.powers[0], self);
    store.reduceEffect(state, powerEffect);
  } catch {
    return state;
  }

  effect.damage = Math.max(0, effect.damage - 10);
  return state;
}

export class Arbok extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Ekans';

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 70;

  public powers = [
    {
      name: 'Intimidating Fang',
      powerType: PowerType.POKEBODY,
      text:
        'As long as Arbok is your Active Pokémon, any damage done to your Pokémon by an opponent\'s attack is ' +
        'reduced by 10 (before applying Weakness and Resistance).'
    },
  ];

  public attacks = [
    {
      name: 'Toxic',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: '20',
      text:
        'The Defending Pokémon is now Poisoned. Put 2 damage counters instead of 1 on the Defending Pokémon between ' +
        'turns.'
    },
  ];

  public weakness = [
    { type: CardType.PSYCHIC }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Arbok';

  public fullName: string = 'Arbok SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // For Defending Pokemon use DealDamageEffect (before Weakness and Resistance)
    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target === opponent.active) {
        return useIntimidatingFang(effect, store, state, this);
      }
    }

    // For Benched Pokemon use PutDamageEffect
    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.bench.includes(effect.target)) {
        return useIntimidatingFang(effect, store, state, this);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
      specialCondition.poisonDamage = 20;
      return store.reduceEffect(state, specialCondition);
    }

    return state;
  }
}
