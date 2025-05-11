import { CardType, SuperType } from '@ptcg/common';

export interface DeckEditToolbarFilter {
  formatName: string;
  superTypes: SuperType[];
  cardTypes: CardType[];
  searchValue: string;
}
