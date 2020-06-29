import { GameError, GameMessage } from "../../game-error";
import { Effect } from "../effects/effect";
import { State } from "../state/state";
import { StoreLike } from "../store-like";
import {
  AttackEffect,
  CheckAttackCostEffect,
  CheckEnoughEnergyEffect,
  DealDamageEffect,
  UseAttackEffect,
} from "../effects/game-effects";
import {StateUtils} from "../state-utils";

export function attackReducer(store: StoreLike, state: State, effect: Effect): State {

  /* Attack effects */
  if (effect instanceof CheckEnoughEnergyEffect) {
    effect.enoughEnergy = StateUtils.checkEnoughEnergy(effect.source.cards, effect.cost);
    return state;
  }

  if (effect instanceof DealDamageEffect) {
    const target = effect.target;
    const pokemonCard = target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }
    target.damage += effect.damage;
    return state;
  }

  if (effect instanceof UseAttackEffect) {
    const player = effect.player;
    if (state.players.length !== 2 || state.players.indexOf(player) === -1) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    const opponent = state.players[0] === player ? state.players[1] : state.players[0];
    const attack = effect.attack;
    const checkAttackCost = new CheckAttackCostEffect(player, attack);
    state = store.reduceEffect(state, checkAttackCost);

    const checkEnoughEnergy = new CheckEnoughEnergyEffect(player, checkAttackCost.cost);
    state = store.reduceEffect(state, checkEnoughEnergy);

    if (checkEnoughEnergy.enoughEnergy === false) {
      throw new GameError(GameMessage.NOT_ENOUGH_ENERGY);
    }

    state = store.reduceEffect(state, new AttackEffect(player, attack));

    if (attack.damage > 0) {
      const dealDamage = new DealDamageEffect(player, attack.damage, opponent.active, player.active);
      state = store.reduceEffect(state, dealDamage);
    }

    return state;
  }

  return state;
}
