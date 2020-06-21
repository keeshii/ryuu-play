import { Action } from "../actions/action";
import { AttachEnergyEffect } from "../effects/play-card-effects";
import { CardList } from "../state/card-list";
import { GameError, GameMessage } from "../../game-error";
import { PlayCardAction, PlayerType, SlotType, CardTarget } from "../actions/play-card-action";
import { State, GamePhase } from "../state/state";
import { StoreLike } from "../store-like";
import { SuperType } from "../card/card-types";
import { effectsReducer } from "./effects-reducer";

function findCardList(state: State, target: CardTarget): CardList | undefined {
  const player = target.player === PlayerType.BOTTOM_PLAYER
    ? state.players[state.activePlayer]
    : state.players[state.activePlayer ? 0 : 1];

  switch (target.slot) {
    case SlotType.ACTIVE:
      return player.active;
    case SlotType.BENCH:
      return player.bench[target.index];
  }
}

export function playCardReducer(store: StoreLike, state: State, action: Action): State {
  const player = state.players[state.activePlayer];

  if (state.phase === GamePhase.PLAYER_TURN) {

    if (action instanceof PlayCardAction) {
      store.log(state, 'PlayCardAction ' + JSON.stringify(action));
      const handCard = player.hand.cards[action.handIndex];

      if (handCard === undefined) {
        throw new GameError(GameMessage.UNKNOWN_CARD);
      }

      if (handCard.superType === SuperType.ENERGY) {
        const target = findCardList(state, action.target);
        if (target === undefined || target.cards.length === 0) {
          throw new GameError(GameMessage.INVALID_TARGET);
        }

        const effect = new AttachEnergyEffect(player, player.hand, handCard, target);
        return effectsReducer(store, state, effect);
      }
    }

  }

  return state;
}
