import { Effect, EndTurnEffect, PlayerType, PokemonCard, PokemonSlot, State, StateUtils, StoreLike } from '@ptcg/common';

import { CommonMarker } from '../common.interfaces';

const OPPONENT_TURN_MARKER = 'OPPONENT_TURN_MARKER';
const CLEAR_OPPONENT_TURN_MARKER = 'CLEAR_OPPONENT_TURN_MARKER';


export const duringOpponentNextTurn: CommonMarker<[PokemonSlot]> = function (
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {

  if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(CLEAR_OPPONENT_TURN_MARKER, self)) {
    effect.player.marker.removeMarker(CLEAR_OPPONENT_TURN_MARKER, self);
    const player = effect.player;
    const opponent = StateUtils.getOpponent(state, effect.player);

    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, pokemonSlot => {
      pokemonSlot.marker.removeMarker(OPPONENT_TURN_MARKER, self);
    });

    opponent.forEachPokemon(PlayerType.TOP_PLAYER, pokemonSlot => {
      pokemonSlot.marker.removeMarker(OPPONENT_TURN_MARKER, self);
    });
  }

  return {
    setMarker: (playerEffect, pokemonSlot) => {
      const player = playerEffect.player;
      const opponent = StateUtils.getOpponent(state, player);
      pokemonSlot.marker.addMarker(OPPONENT_TURN_MARKER, self);
      opponent.marker.addMarker(CLEAR_OPPONENT_TURN_MARKER, self);
    },
    hasMarker: (playerEffect, target) => {
      return target.marker.hasMarker(OPPONENT_TURN_MARKER, self);
    }
  };

};
