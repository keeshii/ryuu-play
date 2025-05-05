import { ChooseEnergyPrompt } from '../prompts/choose-energy-prompt';
import { GameError } from '../../game-error';
import { GameMessage, GameLog } from '../../game-message';
import { Effect } from '../effects/effect';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { RetreatEffect } from '../effects/game-effects';
import { StateUtils } from '../state-utils';
import { CheckRetreatCostEffect, CheckProvidedEnergyEffect } from '../effects/check-effects';
import { SpecialCondition } from '../card/card-types';


function retreatPokemon(store: StoreLike, state: State, effect: RetreatEffect) {
  const player = effect.player;
  const activePokemon = player.active.getPokemonCard();
  const benchedPokemon = player.bench[effect.benchIndex].getPokemonCard();
  if (activePokemon === undefined || benchedPokemon === undefined) {
    return;
  }

  store.log(state, GameLog.LOG_PLAYER_RETREATS, {
    name: player.name,
    active: activePokemon.name,
    benched: benchedPokemon.name
  });
  player.retreatedTurn = state.turn;
  player.switchPokemon(player.bench[effect.benchIndex]);
}

export function retreatReducer(store: StoreLike, state: State, effect: Effect): State {

  /* Retreat pokemon */
  if (effect instanceof RetreatEffect) {
    const player = effect.player;

    if (player.bench[effect.benchIndex].cards.length === 0) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }

    const sp = player.active.specialConditions;
    if (sp.includes(SpecialCondition.PARALYZED) || sp.includes(SpecialCondition.ASLEEP)) {
      throw new GameError(GameMessage.BLOCKED_BY_SPECIAL_CONDITION);
    }

    if (player.retreatedTurn === state.turn) {
      throw new GameError(GameMessage.RETREAT_ALREADY_USED);
    }

    const checkRetreatCost = new CheckRetreatCostEffect(effect.player);
    state = store.reduceEffect(state, checkRetreatCost);

    if (checkRetreatCost.cost.length === 0) {
      retreatPokemon(store, state, effect);
      return state;
    }

    const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
    state = store.reduceEffect(state, checkProvidedEnergy);

    const enoughEnergies = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, checkRetreatCost.cost);
    if (enoughEnergies === false) {
      throw new GameError(GameMessage.NOT_ENOUGH_ENERGY);
    }

    return store.prompt(state, new ChooseEnergyPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_SWITCH,
      checkProvidedEnergy.energyMap,
      checkRetreatCost.cost
    ), energy => {
      if (energy === null) {
        return; // operation cancelled
      }
      const activePokemon = player.active.getPokemonCard();
      const benchedPokemon = player.bench[effect.benchIndex].getPokemonCard();
      if (activePokemon === undefined || benchedPokemon === undefined) {
        return;
      }

      const cards = energy.map(e => e.card);
      player.active.moveCardsTo(cards, player.discard);
      retreatPokemon(store, state, effect);
    });
  }

  return state;
}
