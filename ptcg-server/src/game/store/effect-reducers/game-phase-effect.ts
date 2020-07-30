import { Effect } from "../effects/effect";
import { EndTurnEffect, BetweenTurnsEffect } from "../effects/game-phase-effects";
import { GameError, GameMessage } from "../../game-error";
import { Player } from "../state/player";
import { SpecialCondition } from "../card/card-types";
import { State, GamePhase, GameWinner } from "../state/state";
import { StoreLike } from "../store-like";
import { checkState, endGame } from "./check-effect";
import { CoinFlipPrompt } from "../prompts/coin-flip-prompt";

function getActivePlayer(state: State): Player {
  return state.players[state.activePlayer];
}

export function betweenTurns(store: StoreLike, state: State, onComplete: () => void): State {
  if (state.phase === GamePhase.PLAYER_TURN || state.phase === GamePhase.ATTACK) {
    state.phase = GamePhase.BETWEEN_TURNS;
  }

  for (const player of state.players) {
    store.reduceEffect(state, new BetweenTurnsEffect(player));
  }

  state = store.waitPrompt(state, () => {
    checkState(store, state, () => onComplete());
  });
  return state;
}

export function initNextTurn(store: StoreLike, state: State): State {
  if ([GamePhase.SETUP, GamePhase.BETWEEN_TURNS].indexOf(state.phase) === -1) {
    return state;
  }

  let player: Player = getActivePlayer(state);

  if (state.phase === GamePhase.SETUP) {
    state.phase = GamePhase.PLAYER_TURN;
  }

  if (state.phase === GamePhase.BETWEEN_TURNS) {
    state.activePlayer = state.activePlayer ? 0 : 1;
    state.phase = GamePhase.PLAYER_TURN;
    player = getActivePlayer(state);
  }

  // Remove Paralyzed at the beginning of the turn
  const index = player.active.specialConditions.indexOf(SpecialCondition.PARALYZED);
  player.active.specialConditions.splice(index, 1);

  state.turn++;
  store.log(state, `Turn ${state.turn}.`);

  // Draw card at the beginning
  store.log(state, `${player.name} draws a card.`);
  if (player.deck.cards.length === 0) {

    store.log(state, `${player.name} has no more cards in the deck.`);
    const winner = state.activePlayer ? GameWinner.PLAYER_1 : GameWinner.PLAYER_2;
    state = endGame(store, state, winner);
    return state;
  }

  player.deck.moveTo(player.hand, 1);
  return state;
}

function* startNextTurn(next: Function, store: StoreLike, state: State): IterableIterator<State> {
  const player = state.players[state.activePlayer];
  store.log(state, `${player.name} ends the turn.`);

  yield betweenTurns(store, state, () => {
    next();
  });

  if (state.phase !== GamePhase.FINISHED) {
    return initNextTurn(store, state);;
  }

  return state;
}

function handleSpecialConditions(store: StoreLike, state: State, effect: BetweenTurnsEffect) {
  const player = effect.player;
  for (const sp of player.active.specialConditions) {
    switch (sp) {
      case SpecialCondition.POISONED:
        player.active.damage += effect.poisonDamage;
        break;
      case SpecialCondition.BURNED:
        if (effect.burnFlipResult === true) {
          break;
        }
        if (effect.burnFlipResult === false) {
          player.active.damage += effect.burnDamage;
          break;
        }
        store.prompt(state, new CoinFlipPrompt(
          player.id,
          GameMessage.BURNED_DAMAGE_FLIP
        ), result => {
          if (result === false) {
            player.active.damage += effect.burnDamage;
          }
        })
        break;
      case SpecialCondition.ASLEEP:
        if (effect.asleepFlipResult === true) {
          const index = player.active.specialConditions.indexOf(sp);
          player.active.specialConditions.splice(index, 1);
          break;
        }
        if (effect.asleepFlipResult === false) {
          break;
        }
        store.prompt(state, new CoinFlipPrompt(
          player.id,
          GameMessage.ASLEEP_FLIP
        ), result => {
          if (result === true) {
            const index = player.active.specialConditions.indexOf(sp);
            player.active.specialConditions.splice(index, 1);
          }
        })
        break;
    }
  }
}

export function gamePhaseReducer(store: StoreLike, state: State, effect: Effect): State {

  if (effect instanceof EndTurnEffect) {
    const player = state.players[state.activePlayer];

    if (player === undefined) {
      throw new GameError(GameMessage.NOT_YOUR_TURN);
    }

    state = checkState(store, state, () => {
      if (state.phase === GamePhase.FINISHED) {
        return;
      }

      let generator: IterableIterator<State>;
      generator = startNextTurn(() => generator.next(), store, state);
      return generator.next().value;
    });

    return state;
  }

  if (effect instanceof BetweenTurnsEffect) {
    handleSpecialConditions(store, state, effect);
  }

  return state;
}
