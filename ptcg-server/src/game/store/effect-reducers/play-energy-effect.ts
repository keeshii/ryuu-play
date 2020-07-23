import { AttachEnergyEffect } from "../effects/play-card-effects";
import { GameError, GameMessage } from "../../game-error";
import { Effect } from "../effects/effect";
import { State } from "../state/state";
import { StoreLike } from "../store-like";


export function playEnergyReducer(store: StoreLike, state: State, effect: Effect): State {


  /* Play energy card */
  if (effect instanceof AttachEnergyEffect) {
    const pokemonCard = effect.target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }

    store.log(state, `${effect.player.name} attaches a ${effect.energyCard.name} to the ${pokemonCard.name}.`);
    effect.player.hand.moveCardTo(effect.energyCard, effect.target);
    return state;
  }

  return state;
}

