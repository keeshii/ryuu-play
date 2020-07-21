import { ChooseEnergyPrompt } from "../prompts/choose-energy-prompt";
import { GameError, GameMessage } from "../../game-error";
import { Effect } from "../effects/effect";
import { State } from "../state/state";
import { StoreLike } from "../store-like";
import { RetreatEffect } from "../effects/game-effects";
import { StateUtils } from "../state-utils";
import { CheckRetreatCostEffect } from "../effects/check-effects";
import {SpecialCondition} from "../card/card-types";


function retreatPokemon(store: StoreLike, state: State, effect: RetreatEffect) {
  const player = effect.player;
  const activePokemon = player.active.getPokemonCard();
  const benchedPokemon = player.bench[effect.benchIndex].getPokemonCard();
  if (activePokemon === undefined || benchedPokemon === undefined) {
    return;
  }

  store.log(state, `${player.name} retreats ${activePokemon.name} to ${benchedPokemon.name}.`);
  player.active.clearEffects();
  const temp = player.active;
  player.active = player.bench[effect.benchIndex];
  player.bench[effect.benchIndex] = temp;
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
    player.retreatedTurn = state.turn;

    const checkRetreatCost = new CheckRetreatCostEffect(effect.player);
    state = store.reduceEffect(state, checkRetreatCost);

    if (checkRetreatCost.cost.length === 0) {
      retreatPokemon(store, state, effect);
      return state;
    }

    const enoughEnergies = StateUtils.checkEnoughEnergy(player.active.cards, checkRetreatCost.cost);
    if (enoughEnergies === false) {
      throw new GameError(GameMessage.NOT_ENOUGH_ENERGY);
    }

    const prompt = new ChooseEnergyPrompt(
      player.id,
      GameMessage.RETREAT_MESSAGE,
      player.active,
      checkRetreatCost.cost
    );

    return store.prompt(state, prompt, cards => {
      if (cards === null) {
        return; // operation cancelled
      }
      const isEnough = StateUtils.checkExactEnergy(cards, checkRetreatCost.cost);
      if (!isEnough) {
        throw new GameError(GameMessage.ILLEGAL_ACTION);
      }
      const activePokemon = player.active.getPokemonCard();
      const benchedPokemon = player.bench[effect.benchIndex].getPokemonCard();
      if (activePokemon === undefined || benchedPokemon === undefined) {
        return;
      }

      player.active.moveCardsTo(cards, player.discard);
      retreatPokemon(store, state, effect);
    });
  }

  return state;
}
