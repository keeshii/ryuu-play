import { Action } from "../actions/action";
import { AddPlayerAction } from "../actions/add-player-action";
import { AlertPrompt } from "../prompts/alert-prompt";
import { Card } from "../card/card";
import { CardList } from "../state/card-list";
import { CoinFlipPrompt } from "../prompts/coin-flip-prompt";
import { ConfirmPrompt } from "../prompts/confirm-prompt";
import { ChooseCardsPrompt } from "../prompts/choose-cards-prompt";
import { DeckAnalyser } from "../../cards/deck-analyser";
import { InvitePlayerAction } from "../actions/invite-player-action";
import { InvitePlayerPrompt } from "../prompts/invite-player-prompt";
import { Player } from "../state/player";
import { ShuffleDeckPrompt } from "../prompts/shuffle-prompt";
import { State, GamePhase, GameWinner } from "../state/state";
import { GameError, GameMessage } from "../../game-error";
import { PlayerType } from "../actions/play-card-action";
import { PokemonCardList } from "../state/pokemon-card-list";
import { StoreLike } from "../store-like";
import { SuperType, Stage } from "../card/card-types";
import { WhoBeginsEffect } from "../effects/game-phase-effects";
import { endGame } from "../effect-reducers/check-effect";
import { initNextTurn } from "../effect-reducers/game-phase-effect";


function putStartingPokemonsAndPrizes(player: Player, cards: Card[]): void {
  if (cards.length === 0) {
    return;
  }
  player.hand.moveCardTo(cards[0], player.active);
  for (let i = 1; i < cards.length; i++) {
    player.hand.moveCardTo(cards[i], player.bench[i - 1]);
  }
  for (let i = 0; i < 6; i++) {
    player.deck.moveTo(player.prizes[i], 1);
  }
}

function* setupGame(next: Function, store: StoreLike, state: State): IterableIterator<State> {
  const basicPokemon = {superType: SuperType.POKEMON, stage: Stage.BASIC};
  const chooseCardsOptions = { min: 1, max: 6, allowCancel: false };
  const player = state.players[0];
  const opponent = state.players[1];

  let playerHasBasic = false;
  let opponentHasBasic = false;

  while (!playerHasBasic || !opponentHasBasic) {
    if (!playerHasBasic) {
      player.hand.moveTo(player.deck);
      yield store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
        player.deck.moveTo(player.hand, 7);
        playerHasBasic = player.hand.count(basicPokemon) > 0;
        next();
      });
    }

    if (!opponentHasBasic) {
      opponent.hand.moveTo(opponent.deck);
      yield store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
        opponent.deck.applyOrder(order);
        opponent.deck.moveTo(opponent.hand, 7);
        opponentHasBasic = opponent.hand.count(basicPokemon) > 0;
        next();
      });
    }

    if (playerHasBasic && !opponentHasBasic) {
      store.log(state, `${opponent.name} has no basic Pokemon on the hand.`);
      yield store.prompt(state, [
        new ConfirmPrompt(player.id, GameMessage.SETUP_OPPONENT_NO_BASIC),
        new AlertPrompt(opponent.id, GameMessage.SETUP_PLAYER_NO_BASIC)
      ], results => {
        if (results[0]) {
          player.deck.moveTo(player.hand, 1);
        }
        next();
      });
    }

    if (!playerHasBasic && opponentHasBasic) {
      store.log(state, `${player.name} has no basic Pokemon on the hand.`);
      yield store.prompt(state, [
        new ConfirmPrompt(opponent.id, GameMessage.SETUP_OPPONENT_NO_BASIC),
        new AlertPrompt(player.id, GameMessage.SETUP_PLAYER_NO_BASIC)
      ], results => {
        if (results[0]) {
          opponent.deck.moveTo(opponent.hand, 1);
        }
        next();
      });
    }
  }

  yield store.prompt(state, [
    new ChooseCardsPrompt(player.id, GameMessage.CHOOSE_STARTING_POKEMONS,
      player.hand, basicPokemon, chooseCardsOptions),
    new ChooseCardsPrompt(opponent.id, GameMessage.CHOOSE_STARTING_POKEMONS,
      opponent.hand, basicPokemon, chooseCardsOptions)
  ], choice => {
    putStartingPokemonsAndPrizes(player, choice[0]);
    putStartingPokemonsAndPrizes(opponent, choice[1]);
    next();
  });

  const whoBeginsEffect = new WhoBeginsEffect();
  store.reduceEffect(state, whoBeginsEffect);

  if (whoBeginsEffect.player) {
    state.activePlayer = state.players.indexOf(whoBeginsEffect.player);
  } else {
    const coinFlipPrompt = new CoinFlipPrompt(player.id, GameMessage.SETUP_WHO_BEGINS_FLIP);
    yield store.prompt(state, coinFlipPrompt, whoBegins => {
      state.activePlayer = whoBegins ? 0 : 1;
      next();
    });
  }

  // Set initial Pokemon Played Turn, so players can't evolve during first turn
  const first = state.players[state.activePlayer];
  const second = state.players[state.activePlayer ? 0 : 1];
  first.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => { cardList.pokemonPlayedTurn = 1; });
  second.forEachPokemon(PlayerType.TOP_PLAYER, cardList => { cardList.pokemonPlayedTurn = 2; });

  return initNextTurn(store, state);
}

function createPlayer(id: number, name: string): Player {
  const player = new Player();
  player.id = id;
  player.name = name;

  // Empty prizes, places for 6 cards
  for (let i = 0; i < 6; i++) {
    const prize = new CardList();
    prize.isSecret = true;
    player.prizes.push(prize);
  }

  // Empty bench, places for 5 pokemons
  for (let i = 0; i < 5; i++) {
    const bench = new PokemonCardList();
    bench.isPublic = true;
    player.bench.push(bench);
  }

  player.active.isPublic = true;
  player.discard.isPublic = true;
  return player;
}

export function setupPhaseReducer(store: StoreLike, state: State, action: Action): State {

  if (state.phase === GamePhase.WAITING_FOR_PLAYERS) {

    if (action instanceof AddPlayerAction) {
      if (state.players.length >= 2) {
        throw new GameError(GameMessage.MAX_PLAYERS_REACHED);
      }

      if (state.players.length == 1 && state.players[0].id === action.clientId) {
        throw new GameError(GameMessage.ALREADY_PLAYING);
      }

      const deckAnalyser = new DeckAnalyser(action.deck);
      if (!deckAnalyser.isValid()) {
        throw new GameError(GameMessage.INVALID_DECK);
      }

      const player = createPlayer(action.clientId, action.name);
      player.deck = CardList.fromList(action.deck);
      player.deck.isSecret = true;
      player.deck.cards.forEach(c => {
        state.cardNames.push(c.fullName);
        c.id = state.cardNames.length - 1;
      });

      state.players.push(player);

      if (state.players.length === 2) {
        state.phase = GamePhase.SETUP;
        let generator: IterableIterator<State>;
        generator = setupGame(() => generator.next(), store, state);
        return generator.next().value;
      }

      return state;
    }

    if (action instanceof InvitePlayerAction) {
      if (state.players.length >= 2) {
        throw new GameError(GameMessage.MAX_PLAYERS_REACHED);
      }

      if (state.players.length == 1 && state.players[0].id === action.clientId) {
        throw new GameError(GameMessage.ALREADY_PLAYING);
      }

      const player = createPlayer(action.clientId, action.name);
      state.players.push(player);

      state = store.prompt(state, new InvitePlayerPrompt(
        player.id,
        GameMessage.GAME_INVITATION_MESSAGE
      ), deck => {
        if (deck === null) {
          store.log(state, `${player.name} has not accepted the invitation.`);
          const winner = GameWinner.NONE;
          state = endGame(store, state, winner);
          return;
        }
        const deckAnalyser = new DeckAnalyser(deck);
        if (!deckAnalyser.isValid()) {
          throw new GameError(GameMessage.INVALID_DECK);
        }

        player.deck = CardList.fromList(deck);
        player.deck.isSecret = true;
        player.deck.cards.forEach(c => {
          state.cardNames.push(c.fullName);
          c.id = state.cardNames.length - 1;
        });

        if (state.players.length === 2) {
          state.phase = GamePhase.SETUP;
          let generator: IterableIterator<State>;
          generator = setupGame(() => generator.next(), store, state);
          return generator.next().value;
        }
      });
    }
  }

  return state;
}
