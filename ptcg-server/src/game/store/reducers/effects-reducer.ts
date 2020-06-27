import { AttachEnergyEffect, PlayPokemonEffect } from "../effects/play-card-effects";
import { GameError, GameMessage } from "../../game-error";
import { Effect } from "../effects/effect";
import { Stage } from "../card/card-types";
import { State } from "../state/state";
import { StoreLike } from "../store-like";
import { UseAttackEffect, CheckAttackCostEffect, CheckEnoughEnergyEffect, DealDamageEffect } from "../effects/game-effects";

function reduceCardEffects(store: StoreLike, state: State, effect: Effect): State {
  for (let player of state.players) {
    player.stadium.cards.forEach(c => { state = c.reduceEffect(store, state, effect); });
    player.active.cards.forEach(c => { state = c.reduceEffect(store, state, effect); });
    for (let bench of player.bench) {
      bench.cards.forEach(c => { state = c.reduceEffect(store, state, effect); });
    }
    player.hand.cards.forEach(c => { state = c.reduceEffect(store, state, effect); });
  }
  return state;
}

export function effectsReducer(store: StoreLike, state: State, effect: Effect): State {

  // propagate this effect for every card in the game
  state = reduceCardEffects(store, state, effect);

  if (effect.preventDefault === true) {
    return state;
  }

  if (effect instanceof AttachEnergyEffect) {
    if (effect.player.energyPlayedTurn === state.turn) {
      throw new GameError(GameMessage.ENERGY_ALREADY_ATTACHED);
    }

    effect.player.energyPlayedTurn = state.turn;
    effect.player.hand.moveCardTo(effect.energyCard, effect.target);
    return state;
  }

  if (effect instanceof PlayPokemonEffect) {
    const stage = effect.pokemonCard.stage;
    const isBasic = stage === Stage.BASIC;

    if (isBasic && effect.target.cards.length === 0) {
      effect.player.hand.moveCardTo(effect.pokemonCard, effect.target);
      return state;
    }

    const isEvolved = stage === Stage.STAGE_1 || Stage.STAGE_2;
    const evolvesFrom = effect.pokemonCard.evolvesFrom;
    const pokemonCard = effect.target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }

    if (isEvolved && pokemonCard.stage < stage && pokemonCard.name === evolvesFrom) {
      effect.player.hand.moveCardTo(effect.pokemonCard, effect.target);
      return state;
    }

    throw new GameError(GameMessage.INVALID_TARGET);
  }

  if (effect instanceof CheckEnoughEnergyEffect) {
    // const player = effect.player;
    // const source = effect.source;
    effect.enoughEnergy = true;
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
    if (state.players.length !== 2 || !state.players.includes(player)) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    const opponent = state.players[0] === player ? state.players[1] : state.players[0];
    const attack = effect.attack;
    const checkAttackCost = new CheckAttackCostEffect(player, attack);
    state = effectsReducer(store, state, checkAttackCost);

    const checkEnoughEnergy = new CheckEnoughEnergyEffect(player, checkAttackCost.cost);
    state = effectsReducer(store, state, checkEnoughEnergy);

    if (checkEnoughEnergy.enoughEnergy === false) {
      throw new GameError(GameMessage.NOT_ENOUGH_ENERGY);
    }

    if (attack.damage > 0) {
      const dealDamage = new DealDamageEffect(player, attack.damage, opponent.active, player.active);
      state = effectsReducer(store, state, dealDamage);
    }

    return state;
  }

  return state;
}
