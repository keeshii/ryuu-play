import { Card, Rules } from '../store';

export interface FormatInfo {
  name: string;
  ranges: [number, number][];
  rules: Rules;
}

export interface CardsInfo {
  cards: Card[];
  formats: FormatInfo[];
  hash: string;
}

export interface CardsHash {
  cardsTotal: number;
  hash: string;
}
