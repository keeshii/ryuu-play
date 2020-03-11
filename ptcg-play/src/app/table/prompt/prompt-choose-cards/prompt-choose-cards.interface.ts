import { SortableSpec } from '@angular-skyhook/sortable';

import { PromptItem } from '../prompt-card-item.interface';

export interface PromptSortable {
  spec: SortableSpec<PromptItem>;
  list: PromptItem[];
  tempList: PromptItem[];
}
