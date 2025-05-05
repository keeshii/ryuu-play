import { SimpleTacticList } from './simple-tactics/simple-tactics';
import { PromptResolverList } from './prompt-resolver/prompt-resolver';
import { AttachEnergyTactic } from './simple-tactics/attach-energy-tactic';
import { AttachToolTactic } from './simple-tactics/attach-tool-tactic';
import { AttackTactic } from './simple-tactics/attack-tactic';
import { RetreatTactic } from './simple-tactics/retreat-tactic';
import { EvolveTactic } from './simple-tactics/evolve-tactic';
import { PlayBasicTactic } from './simple-tactics/play-basic-tactic';
import { PlayStadiumTactic } from './simple-tactics/play-stadium-tactic';
import { PlaySupporterTactic } from './simple-tactics/play-supporter-tactic';
import { PlayTrainerTactic } from './simple-tactics/play-trainer-tactic';
import { UseDiscardAbilityTactic } from './simple-tactics/use-discard-ability-tactic';
import { UseAbilityTactic } from './simple-tactics/use-ability-tactic';
import { UseStadiumTactic } from './simple-tactics/use-stadium-tactic';
import { AlertPromptResolver } from './prompt-resolver/alert-prompt-resolver';
import { AttachEnergyPromptResolver } from './prompt-resolver/attach-energy-prompt-resolver';
import { ChooseAttackPromptResolver } from './prompt-resolver/choose-attack-prompt-resolver';
import { ChooseCardsPromptResolver } from './prompt-resolver/choose-cards-prompt-resolver';
import { ChooseEnergyPromptResolver } from './prompt-resolver/choose-energy-prompt-resolver';
import { ChoosePokemonPromptResolver } from './prompt-resolver/choose-pokemon-prompt-resolver';
import { ChoosePrizePromptResolver } from './prompt-resolver/choose-prize-prompt-resolver';
import { ConfirmPromptResolver } from './prompt-resolver/confirm-prompt-resolver';
import { MoveDamagePromptResolver } from './prompt-resolver/move-damage-prompt-resolver';
import { MoveEnergyPromptResolver } from './prompt-resolver/move-energy-prompt-resolver';
import { OrderCardsPromptResolver } from './prompt-resolver/order-cards-prompt-resolver';
import { PutDamagePromptResolver } from './prompt-resolver/put-damage-prompt-resolver';
import { SelectPromptResolver } from './prompt-resolver/select-prompt-resolver';
import { BotFlipMode, BotShuffleMode } from '../game/bots/bot-arbiter';

export const defaultStateScores = {
  hand: {
    hasSupporter: 5,
    hasEnergy: 5,
    hasPokemon: 2,
    hasBasicWhenBenchEmpty: 20,
    evolutionScore: 10,
    itemScore: 2,
    cardScore: 1
  },
  active: {
    hp: 0.3,
    damage: 0.4,
    ability: 1,
    retreat: -5
  },
  bench: {
    hp: 0.1,
    damage: 0.1,
    ability: 25,
    retreat: 0
  },
  energy: {
    active: 30,
    bench: 20,
    missingColorless: -1,
    missingMatch: -2
  },
  specialConditions: {
    burned: -10,
    poisoned: -10,
    asleep: -50,
    paralyzed: -50,
    confused: -20
  },
  player: {
    winner: 10000,
    prize: 1000,
    deck: 1,
    deckLessThan10: -10
  },
  damage: {
    playerActive: -1,
    playerBench: -1,
    opponentActive: 3,
    opponentBench: 1
  },
  opponent: {
    deck: -1,
    hand: -2,
    board: -2,
    energy: -3,
    emptyBench: 50,
    noActiveEnergy: 50
  },
  tools: {
    active: 50,
    hpLeft: 1,
    minScore: 70
  },
  tactics: {
    passTurn: -1000,
    attackBonus: 100,
    supporterBonus: 25
  }
};

export const defaultArbiterOptions = {
  flipMode: BotFlipMode.ALL_HEADS,
  shuffleMode: BotShuffleMode.NO_SHUFFLE
};

export const allPromptResolvers: PromptResolverList = [
  AlertPromptResolver,
  AttachEnergyPromptResolver,
  ChooseAttackPromptResolver,
  ChooseCardsPromptResolver,
  ChooseEnergyPromptResolver,
  ChoosePokemonPromptResolver,
  ChoosePrizePromptResolver,
  ConfirmPromptResolver,
  MoveDamagePromptResolver,
  MoveEnergyPromptResolver,
  OrderCardsPromptResolver,
  PutDamagePromptResolver,
  SelectPromptResolver
];

export const allSimpleTactics: SimpleTacticList = [
  EvolveTactic,
  PlayBasicTactic,
  AttachEnergyTactic,
  AttachToolTactic,
  UseDiscardAbilityTactic,
  PlayTrainerTactic,
  PlayStadiumTactic,
  PlaySupporterTactic,
  UseAbilityTactic,
  UseStadiumTactic,
  RetreatTactic,
  AttackTactic
];
