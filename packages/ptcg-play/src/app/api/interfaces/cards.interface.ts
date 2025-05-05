import { Response } from './response.interface';
import { Card } from '@ryuu-play/ptcg-server';

export interface CardsResponse extends Response {
  cards: Card[];
}
