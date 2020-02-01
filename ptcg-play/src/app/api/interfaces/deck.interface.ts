import { Response } from './response.interface';
import { CardType } from 'ptcg-server';

export interface Deck {
  name: string;
  cardType: CardType[];
  isValid: boolean;
  cards: string[];
}

export interface DeckResponse extends Response {
  decks: Deck[];
}
