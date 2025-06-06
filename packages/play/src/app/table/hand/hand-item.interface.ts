import { SortableSpec } from '@ng-dnd/sortable';
import { Card } from '@ptcg/common';

export const HandCardType = 'HAND_CARD';

export interface HandItem {
  card: Card;
  index: number;
  scanUrl: string;
  spec?: SortableSpec<HandItem, any>;
}
