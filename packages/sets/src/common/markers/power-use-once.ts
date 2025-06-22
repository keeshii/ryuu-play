import { Effect, EndTurnEffect, PlayPokemonEffect, PokemonCard, State, StoreLike } from '@ptcg/common';
import { CommonMarker } from '../common.interfaces';

const POWER_USE_ONCE_MARKER = 'POWER_USE_ONCE_MARKER';

export const powerUseOnce: CommonMarker = function (
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {

  if (effect instanceof PlayPokemonEffect && effect.pokemonCard === self) {
    const player = effect.player;
    player.marker.removeMarker(POWER_USE_ONCE_MARKER, self);
  }

  if (effect instanceof EndTurnEffect) {
    effect.player.marker.removeMarker(POWER_USE_ONCE_MARKER, self);
  }

  return {
    setMarker: playerEffect => {
      const player = playerEffect.player;
      player.marker.addMarker(POWER_USE_ONCE_MARKER, self);
    },
    hasMarker: playerEffect => {
      const player = playerEffect.player;
      return player.marker.hasMarker(POWER_USE_ONCE_MARKER, self);
    }
  };

};
