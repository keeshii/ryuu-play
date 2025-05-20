import { Response } from './response.interface';
import { CardsInfo } from '@ptcg/common';

export interface CardsResponse extends Response {
  cardsInfo: CardsInfo;
}

export interface CardsHashResponse extends Response {
  cardsTotal: number;
  hash: string;
}
