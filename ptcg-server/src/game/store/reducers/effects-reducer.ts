import { AttachEnergyEffect } from "../effects/play-card-effects";
import { GameError, GameMessage } from "../../game-error";
import { Effect } from "../effects/effect";
import { State } from "../state/state";
import { StoreLike } from "../store-like";

export function effectsReducer(store: StoreLike, state: State, effect: Effect): State {

  // to-do
  // propagate this effect for every card in the game

  if (effect.canceled !== undefined) {
    return state;
  }

  if (effect instanceof AttachEnergyEffect) {
    if (effect.source.card === undefined) {
      throw new GameError(GameMessage.UNKNOWN_CARD);
    }
    if (effect.source.player.energyPlayedTurn === state.turn) {
      throw new GameError(GameMessage.ENERGY_ALREADY_ATTACHED);
    }

    effect.source.player.energyPlayedTurn = state.turn;
    effect.source.cardList.moveCardTo(effect.source.card, effect.target.cardList);
    return state;
  }

  return state;
}
