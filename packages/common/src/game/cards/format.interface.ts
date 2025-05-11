import { Card, Rules } from '../../store';

export interface Format {
  name: string;
  cards: Card[];
  ranges: [number, number][];
  rules: Rules;
}
