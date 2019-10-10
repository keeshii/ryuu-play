import { Action } from "../actions/action";
import { AddPlayerAction } from "../actions/add-player-action";
import { AlertPrompt } from "../prompts/alert-prompt";
import { CardList } from "../state/card-list";
import { ConfirmPrompt } from "../prompts/confirm-prompt";
import { Player } from "../state/player";
import { ShuffleDeckPrompt } from "../prompts/shuffle-prompt";
import { State, GamePhase } from "../state/state";
import { StoreError } from "../store-error";
import { StoreLike } from "../store-like";
import { StoreMessage } from "../store-messages";
import { SuperType, Stage } from "../state/card";
import {ChooseCardsPrompt} from "../prompts/choose-cards-prompt";

async function alertAndConfirm(store: StoreLike, confirmPlayer: Player, alertPlayer: Player): Promise<boolean> {
  const results = await Promise.all([
    store.resolve(new ConfirmPrompt(confirmPlayer, StoreMessage.SETUP_OPPONENT_NO_BASIC)),
    store.resolve(new AlertPrompt(alertPlayer, StoreMessage.SETUP_PLAYER_NO_BASIC))
  ]);
  return results[0];
}

async function setupGame(store: StoreLike, state: State) {
  const basicPokemon = {superType: SuperType.POKEMON, stage: Stage.BASIC};
  const chooseCardsOptions = { min: 1, max: 6, allowCancel: false };
  const player = state.players[0];
  const opponent = state.players[1];

  let playerHasBasic = false;
  let opponentHasBasic = false;

  while (!playerHasBasic || !opponentHasBasic) {
    if (!playerHasBasic) {
      player.hand.moveTo(player.deck);
      const order = await store.resolve(new ShuffleDeckPrompt(player));
      player.deck.applyOrder(order);
      player.deck.moveTo(player.hand, 7);
      playerHasBasic = player.hand.count(basicPokemon) > 0;
    }

    if (!opponentHasBasic) {
      opponent.hand.moveTo(opponent.deck);
      const order = await store.resolve(new ShuffleDeckPrompt(opponent));
      opponent.deck.applyOrder(order);
      opponent.deck.moveTo(opponent.hand, 7);
      opponentHasBasic = opponent.hand.count(basicPokemon) > 0;
    }

    if (playerHasBasic && !opponentHasBasic) {
      if (await alertAndConfirm(store, player, opponent)) {
        player.deck.moveTo(player.hand, 1);
      }
    }

    if (!playerHasBasic && opponentHasBasic) {
      if (await alertAndConfirm(store, opponent, player)) {
        opponent.deck.moveTo(opponent.hand, 1);
      }
    }
  }

  const choice = await Promise.all([
    store.resolve(new ChooseCardsPrompt(player, StoreMessage.CHOOSE_STARTING_POKEMONS,
      player.deck, basicPokemon, chooseCardsOptions)),
    store.resolve(new ChooseCardsPrompt(opponent, StoreMessage.CHOOSE_STARTING_POKEMONS,
      opponent.deck, basicPokemon, chooseCardsOptions)),
  ]);

  console.log(choice);
}


export async function setupPhaseReducer(store: StoreLike, state: State, action: Action): Promise<void> {

  if (state.phase === GamePhase.WAITING_FOR_PLAYERS) {

    if (action instanceof AddPlayerAction) {

      if (state.players.length >= 2) {
        throw new StoreError(StoreMessage.MAX_PLAYERS_REACHED);
      }

      let player = new Player();
      player.name = action.name;
      player.deck = CardList.fromList(action.deck);
      state.players.push(player);

      if (state.players.length === 2) {
        state.phase = GamePhase.SETUP;
        setupGame(store, state);
      }

    }
  }

}
