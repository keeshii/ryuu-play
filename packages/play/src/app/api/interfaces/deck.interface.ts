import { Response } from './response.interface';
import { CardType } from '@ptcg/common';

export interface DeckListEntry {
  id: number;
  name: string;
  formatNames: string[];
  cardType: CardType[];
  isValid: boolean;
}

export interface DeckListResponse extends Response {
  decks: DeckListEntry[];
}

export interface Deck {
  id: number;
  name: string;
  cardType: CardType[];
  formatNames: string[];
  isValid: boolean;
  cards: string[];
}

export interface DeckResponse extends Response {
  deck: Deck;
}
