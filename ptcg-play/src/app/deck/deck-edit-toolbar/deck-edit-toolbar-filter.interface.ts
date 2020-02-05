import { CardType, SuperType } from 'ptcg-server';

export interface DeckEditToolbarFilter {
  superTypes: SuperType[];
  cardTypes: CardType[];
  searchValue: string;
}
