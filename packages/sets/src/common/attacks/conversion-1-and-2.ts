import {
  AttackEffect,
  CheckPokemonStatsEffect,
  Effect,
  GameLog,
  GameMessage,
  PokemonCard,
  SelectPrompt,
  State,
  StateUtils,
  StoreLike,
} from '@ptcg/common';
import { changeType } from '../../common';
import { CommonAttack } from '../common.interfaces';

const WEAKNESS_CHANGE_MARKER = 'WEAKNESS_CHANGE_MARKER_';
const RESISTANCE_CHANGE_MARKER = 'RESISTANCE_CHANGE_MARKER_';

// Conversion 1
// If the Defending Pokémon has a Weakness, you may change it to a type of your choice other than Colorless.

// Conversion 2
// Change Porygon's Resistance to a type of your choice other than Colorless.

export const conversion1And2: CommonAttack<[1 | 2]> = function(
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {

  function reduceEffect() {
    if (effect instanceof CheckPokemonStatsEffect) {
      const weakness = changeType.getMarkerType(self, WEAKNESS_CHANGE_MARKER, effect.target);
      const resitance = changeType.getMarkerType(self, RESISTANCE_CHANGE_MARKER, effect.target);

      if (weakness) {
        effect.weakness = effect.weakness.map(w => ({ type: weakness, value: w.value }));
      }

      if (resitance) {
        effect.resistance = effect.resistance.map(r => ({ type: resitance, value: r.value }));
      }

      return state;
    }

    return state;
  }

  state = reduceEffect();

  return {
    use: (attackEffect: AttackEffect, conversionNumber: number) => {
      const player = attackEffect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = opponent.active.getPokemonCard();

      if (!pokemonCard) {
        return state;
      }

      if (conversionNumber === 1 && pokemonCard.weakness.length === 0) {
        return state;
      }

      if (conversionNumber === 2 && pokemonCard.resistance.length === 0) {
        return state;
      }

      return store.prompt(
        state,
        new SelectPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TYPE,
          changeType.PROMPT_OPTIONS.map(p => p.message),
          { allowCancel: true }
        ),
        choice => {
          if (choice === null) {
            return;
          }
          const value = changeType.PROMPT_OPTIONS[choice].value;
          const message = changeType.PROMPT_OPTIONS[choice].message;
          store.log(state, GameLog.LOG_PLAYER_CHANGES_TYPE_TO, { name: player.name, message });

          if (conversionNumber === 1) {
            changeType.removeMarkersByName(WEAKNESS_CHANGE_MARKER, opponent.active);
            opponent.active.marker.addMarker(WEAKNESS_CHANGE_MARKER + value, self);
          }

          if (conversionNumber === 2) {
            changeType.removeMarkersByName(RESISTANCE_CHANGE_MARKER, player.active);
            player.active.marker.addMarker(RESISTANCE_CHANGE_MARKER + value, self);
          }
        }
      );
    }
  };

};
