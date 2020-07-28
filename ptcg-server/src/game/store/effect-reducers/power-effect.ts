import { Effect } from "../effects/effect";
import { State } from "../state/state";
import { StoreLike } from "../store-like";
import { UsePowerEffect, PowerEffect } from "../effects/game-effects";


export function powerReducer(store: StoreLike, state: State, effect: Effect): State {

  if (effect instanceof UsePowerEffect) {
    const player = effect.player;
    const power = effect.power;

    store.log(state, `${player.name} uses the ${power.name} ability.`);
    state = store.reduceEffect(state, new PowerEffect(player, power));
    return state;
  }

  return state;
}
