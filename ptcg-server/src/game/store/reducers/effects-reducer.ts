import { AttachEnergyEffect, PlayPokemonEffect } from "../effects/play-card-effects";
import { GameError, GameMessage } from "../../game-error";
import { Effect } from "../effects/effect";
import { Stage, CardType } from "../card/card-types";
import { State } from "../state/state";
import { StoreLike } from "../store-like";
import {
  CheckAttackCostEffect,
  CheckEnoughEnergyEffect,
  CheckRetreatCostEffect,
  DealDamageEffect,
  RetreatEffect,
  UseAttackEffect
} from "../effects/game-effects";
import {ChooseEnergyPrompt} from "../prompts/choose-energy-prompt";
import {EnergyCard} from "../card/energy-card";
import {Card} from "../card/card";

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

  /* Play energy card */
  if (effect instanceof AttachEnergyEffect) {
    if (effect.player.energyPlayedTurn === state.turn) {
      throw new GameError(GameMessage.ENERGY_ALREADY_ATTACHED);
    }

    effect.player.energyPlayedTurn = state.turn;
    effect.player.hand.moveCardTo(effect.energyCard, effect.target);
    return state;
  }

  /* Play pokemon card */
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

  /* Retreat pokemon */
  if (effect instanceof RetreatEffect) {
    const player = effect.player;

    if (player.bench[effect.benchIndex].cards.length === 0) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }

    const checkRetreatCost = new CheckRetreatCostEffect(effect.player);
    state = effectsReducer(store, state, checkRetreatCost);

    if (checkRetreatCost.cost.length === 0) {
      return state;
    }

    const enoughEnergies = checkEnoughEnergy(player.active.cards, checkRetreatCost.cost);
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
      const isEnough = checkEnoughEnergy(player.active.cards, checkRetreatCost.cost);
      if (!isEnough) {
        return; // operation cancelled, not enough energies
      }
      player.active.moveCardsTo(cards, player.discard);
      const temp = player.active;
      player.active = player.bench[effect.benchIndex];
      player.bench[effect.benchIndex] = temp;
    });
  }

  /* Attack effects */
  if (effect instanceof CheckEnoughEnergyEffect) {
    effect.enoughEnergy = checkEnoughEnergy(effect.source.cards, effect.cost);
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

function checkEnoughEnergy(cards: Card[], cost: CardType[]): boolean {
  if (cost.length === 0) {
    return true;
  }

  const provided: CardType[] = [];
  cards.forEach(card => {
    if (card instanceof EnergyCard) {
      card.provides.forEach(energy => provided.push(energy));
    }
  });

  let colorless = 0;
  let rainbow = 0;

  // First remove from array cards with specific energy types
  cost.forEach(costType => {
    switch (costType) {
      case CardType.ANY:
      case CardType.NONE:
        break;
      case CardType.COLORLESS:
        colorless += 1;
        break;
      default:
        const index = provided.findIndex(energy => energy === costType);
        if (index !== -1) {
          provided.splice(index, 1);
        } else {
          rainbow += 1;
        }
    }
  });

  // Check if we have enough rainbow energies
  for (let i = 0; i < rainbow; i++) {
    const index = provided.findIndex(energy => energy === CardType.ANY);
    if (index !== -1) {
      provided.splice(index, 1);
    } else {
      return false;
    }
  }

  // Rest cards can be used to pay for colorless energies
  return provided.length >= colorless;
}
