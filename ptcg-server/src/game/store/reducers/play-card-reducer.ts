import { Action } from "../actions/action";
import { State, GamePhase } from "../state/state";
import { StoreLike } from "../store-like";
import { PlayCardAction } from "../actions/play-card-action";


export function playCardReducer(store: StoreLike, state: State, action: Action): State {

  if (state.phase === GamePhase.PLAYER_TURN) {

    if (action instanceof PlayCardAction) {
      store.log(state, 'PlayCardAction ' + JSON.stringify(action));

      return state;
    }

  }

  return state;
}
