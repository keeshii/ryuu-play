import { Response } from './response.interface';
import { Card } from '@ptcg/common';

export interface CardsResponse extends Response {
  cards: Card[];
}
