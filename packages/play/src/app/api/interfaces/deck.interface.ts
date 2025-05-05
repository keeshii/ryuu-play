import { Response } from './response.interface';
import { CardType } from '@ptcg/common';

export interface DeckListEntry {
  id: number;
  name: string;
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
  isValid: boolean;
  cards: string[];
}

export interface DeckResponse extends Response {
  deck: Deck;
}
