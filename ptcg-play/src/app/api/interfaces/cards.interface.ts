import { Response } from './response.interface';
import { Card } from 'ptcg-server';

export interface CardsResponse extends Response {
  cards: Card[];
}
