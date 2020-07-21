import { PlayPokemonEffect } from "../effects/play-card-effects";
import { GameError, GameMessage } from "../../game-error";
import { Effect } from "../effects/effect";
import { Stage } from "../card/card-types";
import { State } from "../state/state";
import { StoreLike } from "../store-like";
import { CheckPokemonPlayedTurnEffect } from "../effects/check-effects";


export function playPokemonReducer(store: StoreLike, state: State, effect: Effect): State {

  /* Play pokemon card */
  if (effect instanceof PlayPokemonEffect) {
    const stage = effect.pokemonCard.stage;
    const isBasic = stage === Stage.BASIC;

    if (isBasic && effect.target.cards.length === 0) {
      store.log(state, `${effect.player.name} puts ${effect.pokemonCard.name} on the Bench.`);
      effect.player.hand.moveCardTo(effect.pokemonCard, effect.target);
      effect.target.pokemonPlayedTurn = state.turn;
      return state;
    }

    const isEvolved = stage === Stage.STAGE_1 || Stage.STAGE_2;
    const evolvesFrom = effect.pokemonCard.evolvesFrom;
    const pokemonCard = effect.target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }

    if (isEvolved && pokemonCard.stage < stage && pokemonCard.name === evolvesFrom) {
      const playedTurnEffect = new CheckPokemonPlayedTurnEffect(effect.player, effect.target);
      store.reduceEffect(state, playedTurnEffect);

      if (playedTurnEffect.pokemonPlayedTurn >= state.turn) {
        throw new GameError(GameMessage.POKEMON_CANT_EVOLVE_THIS_TURN);
      }

      store.log(state, `${effect.player.name} evolves ${pokemonCard.name} into ${effect.pokemonCard.name}.`);
      effect.player.hand.moveCardTo(effect.pokemonCard, effect.target);
      effect.target.pokemonPlayedTurn = state.turn;
      return state;
    }

    throw new GameError(GameMessage.INVALID_TARGET);
  }

  return state;
}
