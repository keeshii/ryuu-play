import { SimpleTacticList } from './simple-tactics/simple-tactics';
import { PromptResolverList } from './prompt-resolver/prompt-resolver';

export interface StateScores {
  prizeCard: number;
  deckCard: number;
  opponentHand: number;
  opponentDeck: number;
  lessThan50Hp: number;
  noBenchPokemon: number;
  noHandCards: number;
  pokemonSlot: number;
  attachedEnergy: number;
  missingEnergy: number;
  lessThan10DeckCards: number;
}

export interface SimpleBotOptions {
  tactics: SimpleTacticList;
  scores: StateScores;
  promptResolvers: PromptResolverList;
}
