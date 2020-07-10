import { ChooseEnergyPrompt } from "../prompts/choose-energy-prompt";
import { GameError, GameMessage } from "../../game-error";
import { Effect } from "../effects/effect";
import { State } from "../state/state";
import { StoreLike } from "../store-like";
import {
  CheckRetreatCostEffect,
  RetreatEffect,
} from "../effects/game-effects";
import { StateUtils } from "../state-utils";


export function retreatReducer(store: StoreLike, state: State, effect: Effect): State {

  /* Retreat pokemon */
  if (effect instanceof RetreatEffect) {
    const player = effect.player;

    if (player.bench[effect.benchIndex].cards.length === 0) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }

    const checkRetreatCost = new CheckRetreatCostEffect(effect.player);
    state = store.reduceEffect(state, checkRetreatCost);

    if (checkRetreatCost.cost.length === 0) {
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

      store.log(state, `${player.name} retreats ${activePokemon.name} to ${benchedPokemon.name}.`);
      player.active.moveCardsTo(cards, player.discard);
      const temp = player.active;
      player.active = player.bench[effect.benchIndex];
      player.bench[effect.benchIndex] = temp;
    });
  }

  return state;
}
