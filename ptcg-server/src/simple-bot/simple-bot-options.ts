import { SimpleTacticList } from './simple-tactics/simple-tactics';
import { PromptResolverList } from './prompt-resolver/prompt-resolver';

export interface StateScores {
  state: {
    prize: number;
    hand: number;
    board: number;
  };
  hand: {
    hasSupporter: number;
    hasEnergy: number;
    hasPokemon: number;
    hasBasicWhenBenchEmpty: number;
    evolutionScore: number;
    itemScore: number;
    cardScore: number;
  };
  attacker: {
    hp: number;
    damage: number;
    hasAbility: number;
    retreat: number;
  };
  helper: {
    hp: number;
    damage: number;
    hasAbility: number;
    retreat: number;
  };
  board: {
    activeAttaker: number;
    activeHelper: number;
    benchedAttacker: number;
    benchedSupporter: number;
    attackerEnergy: number;
    helperEnergy: number;
    emptyBenchBonus: number;
    damage: number;
  };
  specialConditions: {
    burned: number;
    poisoned: number;
    asleep: number;
    paralyzed: number;
    confused: number;
  };
  player: {
    prize: number;
    deck: number;
    deckLessThan10: number;
  };
  opponent: {
    deck: number;
    hand: number;
    emptyBench: number;
  };
}

export interface SimpleBotOptions {
  tactics: SimpleTacticList;
  scores: StateScores;
  promptResolvers: PromptResolverList;
}
