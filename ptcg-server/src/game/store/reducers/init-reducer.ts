import { Action } from "../actions/action";
import { State } from "../state/state";
import {AddPlayerAction} from "../actions/add-player-action";
import {StoreError} from "../store-error";
import {Player} from "../state/player";
import {Card} from "../state/card";
import {StoreLike} from "../store-like";
import {ShufflePrompt} from "../promts/shuffle-prompt";

export async function initReducer(store: StoreLike, state: State, action: Action): Promise<void> {

  if (action instanceof AddPlayerAction) {
    if (state.players.length >= 2) {
      throw new StoreError('No slot for the new player in this game.');
    }

    let player = new Player();
    player.name = action.name;
    player.deck.cards = action.deck.map(cardName => new Card(cardName));
    state.players.push(player);

    await store.resolve(new ShufflePrompt(player.deck));

    store.notify();
  }

}
