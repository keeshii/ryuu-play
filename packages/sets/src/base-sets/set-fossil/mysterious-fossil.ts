import {
  Attack,
  CardTag,
  CardType,
  CheckTableStateEffect,
  ConfirmPrompt,
  Effect,
  GameError,
  GameMessage,
  PlayPokemonEffect,
  PokemonCard,
  Power,
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

export class MysteriousFossil extends TrainerCard implements PokemonCard {
  public trainerType: TrainerType = TrainerType.ITEM;

  public tags = [CardTag.FOSSIL];

  public set: string = 'FO';

  public name: string = 'Mysterious Fossil';

  public fullName: string = 'Mysterious Fossil FO';

  public text: string =
    'Play Mysterious Fossil as if it were a Basic Pokémon. While in play, Mysterious Fossil counts as a Pokémon ' +
    '(instead of a Trainer card). Mysterious Fossil has no attacks, can\'t retreat, and can\'t be Asleep, Confused, ' +
    'Paralyzed, or Poisoned. If Mysterious Fossil is Knocked Out, it doesn\'t count as a Knocked Out Pokémon. ' +
    '(Discard it anyway.) At any time during your turn before your attack, you may discard Mysterious Fossil from ' +
    'play.';

  public useWhenInPlay = true;

  public attacks: Attack[] = [];

  public powers: Power[] = [];

  public resistance: Resistance[] = [];

  public weakness: Weakness[] = [];

  public hp = 10;

  public retreat: CardType[] = [];

  public stage: Stage = Stage.BASIC;

  public evolvesFrom = '';

  public cardTypes: CardType[] = [CardType.COLORLESS];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
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
