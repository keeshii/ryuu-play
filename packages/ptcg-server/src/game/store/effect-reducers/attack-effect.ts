import { GameError } from '../../game-error';
import { GameMessage } from '../../game-message';
import { Effect } from '../effects/effect';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { PutDamageEffect, DealDamageEffect, DiscardCardsEffect,
  AddMarkerEffect, HealTargetEffect, AddSpecialConditionsEffect,
  RemoveSpecialConditionsEffect, ApplyWeaknessEffect, AfterDamageEffect,
  PutCountersEffect } from '../effects/attack-effects';
import { HealEffect } from '../effects/game-effects';
import { StateUtils } from '../state-utils';

export function attackReducer(store: StoreLike, state: State, effect: Effect): State {

  if (effect instanceof PutDamageEffect) {
    const target = effect.target;
    const pokemonCard = target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    const damage = Math.max(0, effect.damage);
    target.damage += damage;

    if (damage > 0) {
      const afterDamageEffect = new AfterDamageEffect(effect.attackEffect, damage);
      afterDamageEffect.target = effect.target;
      store.reduceEffect(state, afterDamageEffect);
    }
  }

  if (effect instanceof DealDamageEffect) {
    const base = effect.attackEffect;

    const applyWeakness = new ApplyWeaknessEffect(base, effect.damage);
    applyWeakness.target = effect.target;
    applyWeakness.ignoreWeakness = base.ignoreWeakness;
    applyWeakness.ignoreResistance = base.ignoreResistance;
    state = store.reduceEffect(state, applyWeakness);

    const dealDamage = new PutDamageEffect(base, applyWeakness.damage);
    dealDamage.target = effect.target;
    state = store.reduceEffect(state, dealDamage);

    return state;
  }

  if (effect instanceof PutCountersEffect) {
    const target = effect.target;
    const pokemonCard = target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    const damage = Math.max(0, effect.damage);
    target.damage += damage;
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
    if (effect.poisonDamage !== undefined) {
      target.poisonDamage = effect.poisonDamage;
    }
    return state;
  }

  if (effect instanceof RemoveSpecialConditionsEffect) {
    const target = effect.target;
    effect.specialConditions.forEach(sp => {
      target.removeSpecialCondition(sp);
    });
    return state;
  }

  return state;
}
