import { Action } from "../actions/action";
import { AddPlayerAction } from "../actions/add-player-action";
import { CardList } from "../state/card-list";
import { Player } from "../state/player";
import { ShuffleDeckPrompt } from "../prompts/shuffle-prompt";
import { State, GamePhase } from "../state/state";
import { StoreError } from "../store-error";
import { StoreLike } from "../store-like";
import {SuperType, Stage} from "../state/card";
import {ConfirmPrompt} from "../prompts/confirm-prompt";
import {AlertPrompt} from "../prompts/alert-prompt";

/*
The function below to be considered later.

import { SuperType, Stage } from "../state/card";

async function setupPlayer(store: StoreLike, player: Player) {
  let setupComplete = false;

  while (!setupComplete) {
    const deck = await store.resolve(new ShuffleDeckPrompt(player));

    const cards = deck.top(7);

    const pokemons = await store.resolve(new ChooseCardsPrompt(
      'Select your active and benched pokemons',
      cards,
      { superType: SuperType.POKEMON, stage: Stage.BASIC },
      { min: 1, max: 6, allowCancel: false }
    ));

  }

}
*/

async function setupGame(store: StoreLike, state: State) {
  const basicPokemon = {superType: SuperType.POKEMON, stage: Stage.BASIC};
  const drawMessage = 'Your opponent has not basic pokemon. Draw?';
  const player = state.players[0];
  const opponent = state.players[1];

  let playerHasBasic = false;
  let opponentHasBasic = false;
  
  while (!playerHasBasic || !opponentHasBasic) {
    if (!playerHasBasic) {
      player.hand.moveTo(player.deck);
      store.notify();
      player.deck = await store.resolve(new ShuffleDeckPrompt(player));
      player.deck.moveTo(player.hand, 7);
      playerHasBasic = player.hand.count(basicPokemon) > 0;
      store.notify();
    }

    if (!opponentHasBasic) {
      opponent.hand.moveTo(opponent.deck);
      store.notify();
      await Promise.all([
        store.resolve(new AlertPrompt(player, 'No basic on hand')),
        store.resolve(new ShuffleDeckPrompt(opponent)),
      ]);
      opponent.deck.moveTo(opponent.hand, 7);
      opponentHasBasic = opponent.hand.count(basicPokemon) > 0;
      store.notify();
    }

    if (playerHasBasic && !opponentHasBasic) {
      const result = await store.resolve(new ConfirmPrompt(player, drawMessage));
      if (result) {
        player.deck.moveTo(player.hand, 1);
        store.notify();
      }
    }

    if (!playerHasBasic && opponentHasBasic) {
      const result = await store.resolve(new ConfirmPrompt(opponent, drawMessage));
      if (result) {
        opponent.deck.moveTo(opponent.hand, 1);
      }
    }
  }

  store.notify();
}


export async function setupPhaseReducer(store: StoreLike, state: State, action: Action): Promise<void> {

  if (state.phase === GamePhase.WAITING_FOR_PLAYERS) {

    if (action instanceof AddPlayerAction) {

      if (state.players.length >= 2) {
        throw new StoreError('Maximum number of players.');
      }

      let player = new Player();
      player.name = action.name;
      player.deck = CardList.fromList(action.deck);
      state.players.push(player);

      if (state.players.length === 2) {
        state.phase = GamePhase.SETUP;
        setupGame(store, state);
      }

      store.notify();
    }

  }

}
