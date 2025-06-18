import { Effect, EndTurnEffect, PokemonCard, State, StoreLike } from '@ptcg/common';
import { CommonMarker } from '../common.interfaces';

const NEXT_TURN_1_MARKER = 'NEXT_TURN_1_MARKER';
const NEXT_TURN_2_MARKER = 'NEXT_TURN_2_MARKER';

export const duringYourNextTurn: CommonMarker = function (
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {

  if (effect instanceof EndTurnEffect) {
    const marker = effect.player.active.marker;
    if (marker.hasMarker(NEXT_TURN_2_MARKER, self)) {
      marker.removeMarker(NEXT_TURN_2_MARKER, self);
    } else if (marker.hasMarker(NEXT_TURN_1_MARKER, self)) {
      marker.removeMarker(NEXT_TURN_1_MARKER, self);
    }
  }

  return {
    setMarker: (effect) => {
      const player = effect.player;
      player.active.marker.addMarker(NEXT_TURN_1_MARKER, self);
      player.active.marker.addMarker(NEXT_TURN_2_MARKER, self);
    },
    hasMarker: (effect) => {
      const player = effect.player;
      return player.active.marker.hasMarker(NEXT_TURN_1_MARKER, self);
    }
  };

};
