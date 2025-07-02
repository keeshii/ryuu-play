import {
  AfterDamageEffect,
  CardType,
  Effect,
  GamePhase,
  PokemonCard,
  PowerEffect,
  PowerType,
  SpecialCondition,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';

export class Cacnea extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.GRASS];

  public hp: number = 50;

  public powers = [
    {
      name: 'Poison Payback',
      powerType: PowerType.POKEBODY,
      text:
        'If Cacnea is your Active Pokémon and is damaged by an opponent\'s attack (even if Cacnea is Knocked Out), ' +
        'the Attacking Pokémon is now Poisoned.'
    },
  ];

  public attacks = [
    {
      name: 'Light Punch',
      cost: [CardType.COLORLESS],
      damage: '10',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.FIRE }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Cacnea';

  public fullName: string = 'Cacnea SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterDamageEffect && effect.target.pokemons.cards.includes(this)) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      // No damage, or damage done by itself, or Carvanha is not active
      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== effect.target) {
        return state;
      }

      // Pokemon is evolved, Not an attack
      if (effect.target.getPokemonCard() !== this || state.phase !== GamePhase.ATTACK) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      // Add condition to the Attacking Pokemon
      player.active.addSpecialCondition(SpecialCondition.POISONED);
    }

    return state;
  }
}
