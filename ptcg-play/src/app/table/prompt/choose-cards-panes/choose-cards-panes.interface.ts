import { SortableSpec } from '@ng-dnd/sortable';
import { CardList, Card } from 'ptcg-server';

import { PromptItem } from '../prompt-card-item.interface';

export interface ChooseCardsSortable {
  spec: SortableSpec<PromptItem>;
  list: PromptItem[];
  tempList: PromptItem[];
}

export interface ChooseCardsOptions {
  cards: CardList;
  filter: Partial<Card>;
}
