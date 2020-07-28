import { AttachPokemonToolEffect, TrainerEffect, PlaySupporterEffect, PlayItemEffect } from "../effects/play-card-effects";
import { GameError, GameMessage } from "../../game-error";
import { Effect } from "../effects/effect";
import { State } from "../state/state";
import { StoreLike } from "../store-like";


export function playTrainerReducer(store: StoreLike, state: State, effect: Effect): State {

  /* Play supporter card */
  if (effect instanceof PlaySupporterEffect) {
    if (effect.player.supporterPlayedTurn === state.turn) {
      throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
    }

    effect.player.supporterPlayedTurn = state.turn;

    const playTrainer = new TrainerEffect(effect.player, effect.trainerCard, effect.target);
    state = store.reduceEffect(state, playTrainer);

    return state;
  }

  // Play Pokemon Tool card
  if (effect instanceof AttachPokemonToolEffect) {
    const pokemonCard = effect.target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }
    if (effect.target.tool !== undefined) {
      throw new GameError(GameMessage.POKEMON_TOOL_ALREADY_ATTACHED);
    }

    store.log(state, `${effect.player.name} attaches ${effect.trainerCard.name}. to ${pokemonCard.name}`);
    effect.player.hand.moveCardTo(effect.trainerCard, effect.target);
    effect.target.tool = effect.trainerCard;

    const playTrainer = new TrainerEffect(effect.player, effect.trainerCard, effect.target);
    state = store.reduceEffect(state, playTrainer);

    return state;
  }

  // Play item card
  if (effect instanceof PlayItemEffect) {
    const playTrainer = new TrainerEffect(effect.player, effect.trainerCard, effect.target);
    state = store.reduceEffect(state, playTrainer);
    store.log(state, `${effect.player.name} plays ${effect.trainerCard.name}.`);
    return state;
  }

  // Process trainer effect
  if (effect instanceof TrainerEffect) {
    if (effect.player.hand.cards.includes(effect.trainerCard)) {
      effect.player.hand.moveCardTo(effect.trainerCard, effect.player.discard);
    }
    return state;
  }

  return state;
}
