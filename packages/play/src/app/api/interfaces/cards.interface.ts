import { Response } from './response.interface';
import { Card, CardsInfo } from '@ptcg/common';

export interface CardsData {
  cardsInfo: CardsInfo;
  cards: Card[];
}

export interface CardsResponse extends Response {
  cards: Card[];
}

export interface CardsInfoResponse extends Response {
  cardsInfo: CardsInfo;
}
