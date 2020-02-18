import { Card } from 'ptcg-server';
import { SortableSpec } from '@angular-skyhook/sortable';

import { DeckEditPane } from '../deck-edit-panes/deck-edit-pane.interface';

export interface DeckItem {
  card: Card;
  count: number;
  pane: DeckEditPane;
  scanUrl: string;
}

export interface LibraryItem extends DeckItem {
  spec: SortableSpec<DeckItem, any>;
}
