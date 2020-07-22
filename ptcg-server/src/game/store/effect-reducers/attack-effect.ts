import { GameError, GameMessage } from "../../game-error";
import { EndTurnEffect } from "../effects/game-phase-effects";
import { Effect } from "../effects/effect";
import { State } from "../state/state";
import { StoreLike } from "../store-like";
import { StateUtils } from "../state-utils";
import { CheckPokemonTypeEffect, CheckPokemonStatsEffect,
  CheckProvidedEnergyEffect, CheckAttackCostEffect } from "../effects/check-effects";
import { Weakness, Resistance } from "../card/pokemon-types";
import { CardType, SpecialCondition } from "../card/card-types";
import { AttackEffect, DealDamageEffect, UseAttackEffect,
  DealDamageAfterWeaknessEffect } from "../effects/game-effects";
import { CoinFlipPrompt } from "../prompts/coin-flip-prompt";
import {EnergyCard} from "../card/energy-card";

function applyWeaknessAndResistance(damage: number, cardTypes: CardType[], weakness: Weakness[], resistance: Resistance[]): number {
  let multiply = 1;
  let modifier = 0;

  for (const item of weakness) {
    if (cardTypes.includes(item.type)) {
      if (item.value === undefined) {
        multiply *= 2;
      } else {
        modifier += item.value;
      }
    }
  }

  for (const item of resistance) {
    if (cardTypes.includes(item.type)) {
      modifier += item.value;
    }
  }

  return (damage * multiply) + modifier;
}

function* useAttack(next: Function, store: StoreLike, state: State, effect: UseAttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const sp = player.active.specialConditions;
  if (sp.includes(SpecialCondition.PARALYZED) || sp.includes(SpecialCondition.ASLEEP)) {
    throw new GameError(GameMessage.BLOCKED_BY_SPECIAL_CONDITION);
  }

  if (sp.includes(SpecialCondition.CONFUSED)) {
    let flip = false;

    store.log(state, `${player.name} flips a coin for the confusion.`);
    yield store.prompt(state, new CoinFlipPrompt(
      player.id,
      GameMessage.CONFUSION_FLIP),
      result => {
        flip = result;
      });

    if (flip === false) {
      store.log(state, `Attacking Pokemon hurts itself.`);
      player.active.damage += 30;
      state = store.reduceEffect(state, new EndTurnEffect(player));
      return state;
    }
  }

  const attack = effect.attack;
  const checkAttackCost = new CheckAttackCostEffect(player, attack);
  state = store.reduceEffect(state, checkAttackCost);

  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
  state = store.reduceEffect(state, checkProvidedEnergy);

  if (StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, checkAttackCost.cost) === false) {
    throw new GameError(GameMessage.NOT_ENOUGH_ENERGY);
  }

  store.log(state, `${player.name} attacks with ${attack.name}.`);
  const attackEffect = new AttackEffect(player, attack);
  state = store.reduceEffect(state, attackEffect);

  yield store.waitPrompt(state, () => {
    if (attack.damage > 0) {
      const dealDamage = new DealDamageEffect(
        player, attackEffect.damage, attack, opponent.active, player.active);
      state = store.reduceEffect(state, dealDamage);
    }
    next();
  });

  yield store.waitPrompt(state, () => {
    state = store.reduceEffect(state, new EndTurnEffect(player));
  });

  return state;
}

export function attackReducer(store: StoreLike, state: State, effect: Effect): State {

  /* Attack effects */
  if (effect instanceof CheckProvidedEnergyEffect) {
    effect.source.cards.forEach(c => {
      if (c instanceof EnergyCard && !effect.energyMap.some(e => e.card === c)) {
        effect.energyMap.push({ card: c, provides: c.provides });
      }
    });
    return state;
  }

  if (effect instanceof DealDamageAfterWeaknessEffect) {
    const target = effect.target;
    const pokemonCard = target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    target.damage += Math.max(0, effect.damage);
  }

  if (effect instanceof DealDamageEffect) {
    const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
    state = store.reduceEffect(state, checkPokemonType);
    const checkPokemonStats = new CheckPokemonStatsEffect(effect.target);
    state = store.reduceEffect(state, checkPokemonStats);

    const cardType = checkPokemonType.cardTypes;
    const weakness = checkPokemonStats.weakness;
    const resistance = checkPokemonStats.resistance;
    const damage = applyWeaknessAndResistance(effect.damage, cardType, weakness, resistance);

    const dealDamage = new DealDamageAfterWeaknessEffect(
      effect.player, damage, effect.attack, effect.target, effect.source);
    state = store.reduceEffect(state, dealDamage);

    return state;
  }

  if (effect instanceof UseAttackEffect) {
    let generator: IterableIterator<State>;
    generator = useAttack(() => generator.next(), store, state, effect);
    return generator.next().value;
  }

  return state;
}
