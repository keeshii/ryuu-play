import { Action } from "../actions/action";
import { ChangeAvatarAction } from "../actions/change-avatar-action";
import { GameError } from "../../game-error";
import { GameMessage } from "../../game-message";
import { ReorderBenchAction, ReorderHandAction } from "../actions/reorder-actions";
import { State } from "../state/state";
import { StoreLike } from "../store-like";


export function playerStateReducer(store: StoreLike, state: State, action: Action): State {

  if (action instanceof ReorderBenchAction) {
    const player = state.players.find(p => p.id === action.id);
    if (player === undefined || player.bench[action.from] === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    const temp = player.bench[action.from];
    player.bench[action.from] = player.bench[action.to];
    player.bench[action.to] = temp;

    return state;
  }

  if (action instanceof ReorderHandAction) {
    
    const player = state.players.find(p => p.id === action.id);
    if (player === undefined || player.hand.cards.length !== action.order.length) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    player.hand.applyOrder(action.order);

    return state;
  }

  if (action instanceof ChangeAvatarAction) {

    const player = state.players.find(p => p.id === action.id);
    if (player === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    player.avatarName = action.avatarName;

    return state;
  }

  return state;
}
