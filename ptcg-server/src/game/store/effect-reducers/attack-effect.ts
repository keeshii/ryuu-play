import { GameError, GameMessage } from "../../game-error";
import { EndTurnEffect } from "../effects/game-phase-effects";
import { Effect } from "../effects/effect";
import { State } from "../state/state";
import { StoreLike } from "../store-like";
import { StateUtils } from "../state-utils";
import { CheckPokemonTypeEffect, CheckPokemonStatsEffect } from "../effects/check-effects";
import { Weakness, Resistance } from "../card/pokemon-types";
import { CardType } from "../card/card-types";
import {
  AttackEffect,
  CheckAttackCostEffect,
  CheckEnoughEnergyEffect,
  DealDamageEffect,
  UseAttackEffect,
  DealDamageAfterWeaknessEffect,
} from "../effects/game-effects";

function applyWeaknessAndResistance(damage: number, cardType: CardType, weakness: Weakness[], resistance: Resistance[]): number {
  let multiply = 1;
  let modifier = 0;

  for (const item of weakness) {
    if (item.type === cardType) {
      if (item.value === undefined) {
        multiply *= 2;
      } else {
        modifier += item.value;
      }
    }
  }

  for (const item of resistance) {
    if (item.type === cardType) {
      modifier += item.value;
    }
  }

  return (damage * multiply) + modifier;
}


export function attackReducer(store: StoreLike, state: State, effect: Effect): State {

  /* Attack effects */
  if (effect instanceof CheckEnoughEnergyEffect) {
    effect.enoughEnergy = StateUtils.checkEnoughEnergy(effect.source.cards, effect.cost);
    return state;
  }

  if (effect instanceof DealDamageAfterWeaknessEffect) {
    const target = effect.target;
    const pokemonCard = target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    target.damage += effect.damage;
  }

  if (effect instanceof DealDamageEffect) {
    const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
    state = store.reduceEffect(state, checkPokemonType);
    const checkPokemonStats = new CheckPokemonStatsEffect(effect.target);
    state = store.reduceEffect(state, checkPokemonStats);

    const cardType = checkPokemonType.cardType;
    const weakness = checkPokemonStats.weakness;
    const resistance = checkPokemonStats.resistance;
    const damage = applyWeaknessAndResistance(effect.damage, cardType, weakness, resistance);

    const dealDamage = new DealDamageAfterWeaknessEffect(
      effect.player, damage, effect.attack, effect.target, effect.source);
    state = store.reduceEffect(state, dealDamage);

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

    store.log(state, `${player.name} attacks with ${attack.name}.`);
    state = store.reduceEffect(state, new AttackEffect(player, attack));

    store.waitPrompt(() => {
      if (attack.damage > 0) {
        const dealDamage = new DealDamageEffect(
          player, attack.damage, attack, opponent.active, player.active);
        state = store.reduceEffect(state, dealDamage);
      }

      store.waitPrompt(() => {
        state = store.reduceEffect(state, new EndTurnEffect(player));
      });
    });

    return state;
  }

  return state;
}
