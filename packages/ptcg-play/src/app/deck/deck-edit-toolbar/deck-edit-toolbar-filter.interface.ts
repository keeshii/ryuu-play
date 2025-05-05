import { CardType, SuperType } from '@ryuu-play/ptcg-server';

export interface DeckEditToolbarFilter {
  superTypes: SuperType[];
  cardTypes: CardType[];
  searchValue: string;
}
