import { DragSource } from '@ng-dnd/core';
import { CardTarget, PlayerType, SlotType } from 'ptcg-server';

import { HandItem } from '../hand/hand-item.interface';

export const BoardCardType = 'BOARD_SLOT';

export interface BoardCardItem extends CardTarget {
  player: PlayerType;
  slot: SlotType;
  index: number;
  scanUrl: string;
  source?: DragSource<BoardCardItem>;
}

export type BoardItem = HandItem | BoardCardItem;
