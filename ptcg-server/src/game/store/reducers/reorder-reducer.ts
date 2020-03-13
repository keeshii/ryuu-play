import { Action } from "../actions/action";
import { GameError, GameMessage } from "../../game-error";
import { ReorderHandAction } from "../actions/reorder-hand-action";
import { State } from "../state/state";
import { StoreLike } from "../store-like";


export function reorderReducer(store: StoreLike, state: State, action: Action): State {

  if (action instanceof ReorderHandAction) {
    
    const player = state.players.find(p => p.id === action.id);
    if (player === undefined || player.hand.cards.length !== action.order.length) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    player.hand.applyOrder(action.order);

    return state;
  }

  return state;
}
