import { Card } from '@ptcg/common';
import { SortableSpec } from '@ng-dnd/sortable';

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
