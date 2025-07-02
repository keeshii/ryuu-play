import {
  AfterDamageEffect,
  Attack,
  CardTag,
  CardType,
  CheckTableStateEffect,
  ConfirmPrompt,
  Effect,
  GameError,
  GameMessage,
  GamePhase,
  PlayPokemonEffect,
  PokemonCard,
  PowerEffect,
  PowerType,
  Resistance,
  RetreatEffect,
  Stage,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
  TrainerEffect,
  TrainerType,
  UseTrainerInPlayEffect,
  Weakness,
} from '@ptcg/common';

export class ClawFossil extends TrainerCard implements PokemonCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public tags = [CardTag.FOSSIL];

  public set: string = 'SS';

  public name: string = 'Claw Fossil';

  public fullName: string = 'Claw Fossil SS';

  public text: string =
    'Play Claw Fossil as if it were a Basic Pokémon. While in play, Claw Fossil counts as a C Pokémon (instead of a ' +
    'Trainer card). Claw Fossil has no attacks of its own, can\'t retreat, and can\'t be affected by any Special ' +
    'Conditions. If Claw Fossil is Knocked Out, it doesn\'t count as a Knocked Out Pokémon. (Discard it anyway.) At ' +
    'any time during your turn before your attack, you may discard Claw Fossil from play.';

  public useWhenInPlay = true;

  public attacks: Attack[] = [];

  public powers = [
    {
      name: 'Jagged Stone',
      powerType: PowerType.POKEBODY,
      text:
        'If Claw Fossil is your Active Pokémon and is damaged by an opponent\'s attack ' +
        '(even if Claw Fossil is Knocked Out), put 1 damage counter on the Attacking Pokémon.'
    },
  ];

  public resistance: Resistance[] = [];

  public weakness: Weakness[] = [];

  public hp = 10;

  public retreat: CardType[] = [];

  public stage: Stage = Stage.BASIC;

  public evolvesFrom = '';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AfterDamageEffect && effect.target.pokemons.cards.includes(this)) {
      const player = effect.player;
      const target = effect.target;
      const targetPlayer = StateUtils.findOwner(state, target);

      // No damage, or damage done by itself, or Machamp is not active
      if (effect.damage <= 0 || player === targetPlayer || targetPlayer.active !== target) {
        return state;
      }

      // Pokemon is evolved, Not an attack
      if (target.getPokemonCard() !== this || state.phase !== GamePhase.ATTACK) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      effect.source.damage += 10;
    }

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const pokemonSlot = effect.target;

      if (!pokemonSlot || pokemonSlot.pokemons.cards.length > 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Don't discard this card, put it into play instead
      effect.preventDefault = true;

      // Play this card as Pokemon
      const playPokemonEffect = new PlayPokemonEffect(player, this, pokemonSlot);
      store.reduceEffect(state, playPokemonEffect);
      return state;
    }

    if (effect instanceof UseTrainerInPlayEffect && effect.trainerCard === this) {
      const player = effect.player;
      const pokemonSlot = StateUtils.findPokemonSlot(state, this);

      if (!pokemonSlot || pokemonSlot.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ConfirmPrompt(effect.player.id, GameMessage.WANT_TO_DISCARD_POKEMON), result => {
        if (result) {
          pokemonSlot.moveTo(player.discard);
          pokemonSlot.clearEffects();
        }
      });
    }

    // Block retreat
    if (effect instanceof RetreatEffect && effect.player.active.getPokemonCard() === this) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    // Remove all special conditions from this Pokemon
    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        if (player.active.specialConditions.length === 0) {
          return;
        }
        if (player.active.getPokemonCard() === this) {
          const conditions = player.active.specialConditions.slice();
          conditions.forEach(condition => {
            player.active.removeSpecialCondition(condition);
          });
        }
      });
      return state;
    }

    return state;
  }
}
