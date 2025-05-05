import { CardType, SuperType } from '@ptcg/common';

export interface DeckEditToolbarFilter {
  superTypes: SuperType[];
  cardTypes: CardType[];
  searchValue: string;
}
