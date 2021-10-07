import { SortableSpec } from '@ng-dnd/sortable';
import { Card } from 'ptcg-server';

export const PromptCardType = 'PROMPT_CARD';

export interface PromptItem {
  card: Card;
  index: number;
  isAvailable: boolean;
  isSecret: boolean;
  scanUrl: string;
  spec?: SortableSpec<PromptItem, any>;
}
