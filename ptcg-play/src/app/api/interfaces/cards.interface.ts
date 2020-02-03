import { Response } from './response.interface';
import { CardType, SuperType } from 'ptcg-server';

export interface CardEntry {
  superType: SuperType;
  cardType?: CardType;
  fullName: string;
  name: string;
}

export interface CardsResponse extends Response {
  cards: CardEntry[];
  scansUrl: string;
}
