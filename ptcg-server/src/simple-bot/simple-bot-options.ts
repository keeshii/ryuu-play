import { SimpleTacticList } from './simple-tactics/simple-tactics';
import { PromptResolverList } from './prompt-resolver/prompt-resolver';
import { BotArbiterOptions } from '../game/bots/bot-arbiter';

export interface PokemonScores {
  hp: number;
  damage: number;
  ability: number;
  retreat: number;
}

export interface StateScores {
  hand: {
    hasSupporter: number;
    hasEnergy: number;
    hasPokemon: number;
    hasBasicWhenBenchEmpty: number;
    evolutionScore: number;
    itemScore: number;
    cardScore: number;
  };
  active: PokemonScores;
  bench: PokemonScores;
  energy: {
    active: number;
    bench: number;
    missingColorless: number;
    missingMatch: number;
  };
  specialConditions: {
    burned: number;
    poisoned: number;
    asleep: number;
    paralyzed: number;
    confused: number;
  };
  player: {
    winner: number;
    prize: number;
    deck: number;
    deckLessThan10: number;
  };
  opponent: {
    deck: number;
    hand: number;
    board: number;
    energy: number;
    emptyBench: number;
    noActiveEnergy: number;
  };
  damage: {
    playerActive: number,
    playerBench: number,
    opponentActive: number,
    opponentBench: number
  };
  tools: {
    active: number;
    hpLeft: number;
    minScore: number;
  };
  tactics: {
    passTurn: number;
    attackBonus: number;
    supporterBonus: number;
  };
}

export interface SimpleBotOptions {
  tactics: SimpleTacticList;
  scores: StateScores;
  promptResolvers: PromptResolverList;
  arbiter: BotArbiterOptions;
}
