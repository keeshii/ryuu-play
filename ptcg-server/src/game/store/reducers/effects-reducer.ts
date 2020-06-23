import { AttachEnergyEffect, PlayPokemonEffect } from "../effects/play-card-effects";
import { GameError, GameMessage } from "../../game-error";
import { Effect } from "../effects/effect";
import { Stage } from "../card/card-types";
import { State } from "../state/state";
import { StoreLike } from "../store-like";

function reduceCardEffects(store: StoreLike, state: State, effect: Effect): State {
  for (let player of state.players) {
    player.stadium.cards.forEach(c => { state = c.reduceEffect(store, state, effect); });
    player.active.cards.forEach(c => { state = c.reduceEffect(store, state, effect); });
    for (let bench of player.bench) {
      bench.cards.forEach(c => { state = c.reduceEffect(store, state, effect); });
    }
    player.hand.cards.forEach(c => { state = c.reduceEffect(store, state, effect); });
  }
  return state;
}

export function effectsReducer(store: StoreLike, state: State, effect: Effect): State {

  // propagate this effect for every card in the game
  state = reduceCardEffects(store, state, effect);

  if (effect.preventDefault === true) {
    return state;
  }

  if (effect instanceof AttachEnergyEffect) {
    if (effect.player.energyPlayedTurn === state.turn) {
      throw new GameError(GameMessage.ENERGY_ALREADY_ATTACHED);
    }

    effect.player.energyPlayedTurn = state.turn;
    effect.player.hand.moveCardTo(effect.energyCard, effect.target);
    return state;
  }

  if (effect instanceof PlayPokemonEffect) {
    const stage = effect.pokemonCard.stage;
    const isBasic = stage === Stage.BASIC;

    if (isBasic && effect.target.cards.length === 0) {
      effect.player.hand.moveCardTo(effect.pokemonCard, effect.target);
      return state;
    }

    const isEvolved = stage === Stage.STAGE_1 || Stage.STAGE_2;
    const evolvesFrom = effect.pokemonCard.evolvesFrom;
    const pokemonCard = effect.target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }

    if (isEvolved && pokemonCard.stage < stage && pokemonCard.name === evolvesFrom) {
      effect.player.hand.moveCardTo(effect.pokemonCard, effect.target);
      return state;
    }

    throw new GameError(GameMessage.INVALID_TARGET);
  }

  return state;
}
