import { AttachEnergyEffect } from "../effects/play-card-effects";
import { GameError, GameMessage } from "../../game-error";
import { Effect } from "../effects/effect";
import { State } from "../state/state";
import { StoreLike } from "../store-like";


export function playEnergyReducer(store: StoreLike, state: State, effect: Effect): State {


  /* Play energy card */
  if (effect instanceof AttachEnergyEffect) {
    if (effect.player.energyPlayedTurn === state.turn) {
      throw new GameError(GameMessage.ENERGY_ALREADY_ATTACHED);
    }

    effect.player.energyPlayedTurn = state.turn;
    effect.player.hand.moveCardTo(effect.energyCard, effect.target);
    return state;
  }

  return state;
}

