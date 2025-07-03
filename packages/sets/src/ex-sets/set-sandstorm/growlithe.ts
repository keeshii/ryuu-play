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

export class Growlithe extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardTypes: CardType[] = [CardType.FIRE];

  public hp: number = 50;

  public powers = [
    {
      name: 'Fire Veil',
      powerType: PowerType.POKEBODY,
      text:
        'If Growlithe is your Active Pokémon and is damaged by an opponent\'s attack (even if Growlithe is Knocked ' +
        'Out), the Attacking Pokémon is now Burned.'
    },
  ];

  public attacks = [
    {
      name: 'Flare',
      cost: [CardType.FIRE, CardType.COLORLESS],
      damage: '20',
      text: ''
    },
  ];

  public weakness = [
    { type: CardType.WATER }
  ];

  public retreat = [CardType.COLORLESS];

  public set: string = 'SS';

  public name: string = 'Growlithe';

  public fullName: string = 'Growlithe SS';

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
      player.active.addSpecialCondition(SpecialCondition.BURNED);
    }

    return state;
  }
}
