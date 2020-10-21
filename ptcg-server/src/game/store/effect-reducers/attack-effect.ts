import { GameError, GameMessage } from "../../game-error";
import { Effect } from "../effects/effect";
import { State } from "../state/state";
import { StoreLike } from "../store-like";
import { DealDamageAfterWeaknessEffect, DealDamageEffect, DiscardCardsEffect,
  AddMarkerEffect, HealTargetEffect, AddSpecialConditionsEffect } from "../effects/attack-effects";
import { ApplyWeaknessEffect, HealEffect } from "../effects/game-effects";
import { StateUtils } from "../state-utils";

export function attackReducer(store: StoreLike, state: State, effect: Effect): State {

  if (effect instanceof DealDamageAfterWeaknessEffect) {
    const target = effect.target;
    const pokemonCard = target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    target.damage += Math.max(0, effect.damage);
  }

  if (effect instanceof DealDamageEffect) {
    const applyWeakness = new ApplyWeaknessEffect(
      effect.player, effect.damage, effect.target, effect.source);
    state = store.reduceEffect(state, applyWeakness);

    const dealDamage = new DealDamageAfterWeaknessEffect(
      effect.player, applyWeakness.damage, effect.attack, effect.target, effect.source);
    state = store.reduceEffect(state, dealDamage);

    return state;
  }

  if (effect instanceof DiscardCardsEffect) {
    const target = effect.target;
    const cards = effect.cards;
    const owner = StateUtils.findOwner(state, target);
    target.moveCardsTo(cards, owner.discard);
    return state;
  }

  if (effect instanceof AddMarkerEffect) {
    const target = effect.target;
    target.marker.addMarker(effect.markerName, effect.markerSource);
    return state;
  }

  if (effect instanceof HealTargetEffect) {
    const target = effect.target;
    const owner = StateUtils.findOwner(state, target);
    const healEffect = new HealEffect(owner, target, effect.damage);
    state = store.reduceEffect(state, healEffect);
    return state;
  }

  if (effect instanceof AddSpecialConditionsEffect) {
    const target = effect.target;
    effect.specialConditions.forEach(sp => {
      target.addSpecialCondition(sp);
    });
    return state;
  }

  return state;
}
