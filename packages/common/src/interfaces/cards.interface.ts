import { Rules } from '../store';

export interface FormatInfo {
  name: string;
  ranges: [number, number][];
  rules: Rules;
}

export interface CardsInfo {
  cardsTotal: number;
  formats: FormatInfo[];
  hash: string;
}
