import {
  AttackEffect,
  ChooseAttackPrompt,
  Effect,
  EndTurnEffect,
  GameError,
  GameLog,
  GameMessage,
  PokemonCard,
  State,
  StateUtils,
  StoreLike,
  UseAttackEffect,
} from '@ptcg/common';

import { CommonAttack } from '../common.interfaces';

const AMNESIA_MARKER = 'AMNESIA_MARKER_{name}';

export const amnesia: CommonAttack = function(
  self: PokemonCard,
  store: StoreLike,
  state: State,
  effect: Effect
) {

  function reduceEffect() {
    if (effect instanceof UseAttackEffect) {
      const player = effect.player;
      const markerName = AMNESIA_MARKER.replace('{name}', effect.attack.name);

      if (player.active.marker.hasMarker(markerName, self)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect) {
      const markers = effect.player.active.marker.markers.filter(c => c.source === self);
      for (const marker of markers) {
        effect.player.active.marker.removeMarker(marker.name, marker.source);
      }
    }

    return state;
  }

  state = reduceEffect();

  return {
    use: (attackEffect: AttackEffect) => {
      const player = attackEffect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Choose an opponent's Pokemon attack
      const pokemonCard = opponent.active.getPokemonCard();
      if (pokemonCard === undefined || pokemonCard.attacks.length === 0) {
        return state;
      }

      return store.prompt(
        state,
        new ChooseAttackPrompt(player.id, GameMessage.CHOOSE_ATTACK_TO_DISABLE, [pokemonCard], {
          allowCancel: true,
        }),
        attack => {
          if (attack !== null) {
            store.log(state, GameLog.LOG_PLAYER_DISABLED_ATTACK, { name: player.name, attack: attack.name });
            const markerName = AMNESIA_MARKER.replace('{name}', attack.name);
            opponent.active.marker.addMarker(markerName, self);
          }
        }
      );
    }
  };

};
