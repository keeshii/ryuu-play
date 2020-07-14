import { PlayTrainerEffect, PlaySupporterEffect } from "../effects/play-card-effects";
import { GameError, GameMessage } from "../../game-error";
import { Effect } from "../effects/effect";
import { State } from "../state/state";
import { StoreLike } from "../store-like";


export function playTrainerReducer(store: StoreLike, state: State, effect: Effect): State {

  /* Play trainer card */
  if (effect instanceof PlaySupporterEffect) {
    if (effect.player.supporterPlayedTurn === state.turn) {
      throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
    }

    store.log(state, `${effect.player.name} plays ${effect.trainerCard.name}.`);

    effect.player.hand.moveCardTo(effect.trainerCard, effect.player.discard);
    effect.player.supporterPlayedTurn = state.turn;

    const playTrainer = new PlayTrainerEffect(effect.player, effect.trainerCard, effect.target);
    state = store.reduceEffect(state, playTrainer);

    return state;
  }

  return state;
}
