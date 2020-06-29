import { PlayPokemonEffect } from "../effects/play-card-effects";
import { GameError, GameMessage } from "../../game-error";
import { Effect } from "../effects/effect";
import { Stage } from "../card/card-types";
import { State } from "../state/state";
import { StoreLike } from "../store-like";


export function playPokemonReducer(store: StoreLike, state: State, effect: Effect): State {

  /* Play pokemon card */
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
